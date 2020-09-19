export class Paginator
{
    constructor(data, paginatedElement, paginationElement, rowsPerPage){
        this.currentPage = 1;
        this.data = Array.from(data);
        this.paginatedElement = paginatedElement;
        this.paginationElement = paginationElement;
        this.rowsPerPage = rowsPerPage;
        this.pageCount = Math.ceil(this.data.length / this.rowsPerPage);
        this.pageChangedEvent = new Event("pageChanged", {bubbles: true});
        
        document.addEventListener("pageChanged", this.PageChangedEventHandler.bind(this));
    }
    
    DisplayPage(pageNumber){
        this.paginatedElement.innerHTML = "";
        pageNumber--;
        let start = this.rowsPerPage * pageNumber;
        let end = start + this.rowsPerPage;
        let paginatedData = Array.from(this.data).slice(start, end);
        for(let i = 0; i < paginatedData.length; i++){
            this.paginatedElement.appendChild(paginatedData[i]);
        }
    }

    AddPagination(){
        if (this.paginatedElement != null && this.pageCount > 1){
            this.paginationElement.appendChild(this.PreviousButton());
            
            for (let i = 1; i < this.pageCount + 1; i++){
                let button = this.PaginationButton(i);
                this.paginationElement.appendChild(button);
            }
            
            this.paginationElement.appendChild(this.NextButton());

            document.dispatchEvent(this.pageChangedEvent);
        }
    }

    BasicButton() {
        let button = document.createElement('li');
        button.classList.add("page-item");
        let buttonLink = document.createElement('a');
        buttonLink.classList.add("page-link");
        buttonLink.setAttribute("href", "");
        buttonLink.addEventListener("click", event => event.preventDefault());
        button.appendChild(buttonLink);
        return button;
    }

    PaginationButton(pageNumber){

        let button = this.BasicButton();
        let buttonLink = button.children[0];
        buttonLink.innerText = pageNumber;

        let self = this;
        button.addEventListener('click', function(){
            self.currentPage = pageNumber;
            this.dispatchEvent(self.pageChangedEvent);
        });

        return button;
    }

    PreviousButton(){
        let button = this.BasicButton();
        button.classList.add('previous-button');
        let buttonLink = button.children[0];
        let span = document.createElement('span');
        span.setAttribute('aria-hidden', 'true');
        span.innerHTML = '&laquo;';
        buttonLink.appendChild(span);
        button.appendChild(buttonLink);

        let self = this;
        button.addEventListener('click', function(){
            if (!this.classList.contains('disabled'))
            {
                self.currentPage--;
                this.dispatchEvent(self.pageChangedEvent);
            }
        });

        return button;
    }

    NextButton(){
        let button = this.BasicButton();
        button.classList.add('next-button');
        let buttonLink = button.children[0];
        let span = document.createElement('span');
        span.setAttribute('aria-hidden', 'true');
        span.innerHTML = '&raquo;';
        buttonLink.appendChild(span);
        button.appendChild(buttonLink);

        let self = this;
        button.addEventListener('click', function(){
            if (!this.classList.contains('disabled'))
            {
                self.currentPage++;
                this.dispatchEvent(self.pageChangedEvent);
            }
        });

        return button;
    }

    PageChangedEventHandler(){
        let previousActiveButton = document.querySelector('.page-item.active');
        if(previousActiveButton != null) previousActiveButton.classList.remove('active');
        this.DisplayPage(this.currentPage);
        
        let pageLinks = Array.from(document.querySelectorAll('.page-item .page-link'));
        
        if (pageLinks.length > 0){
            let activeLink = pageLinks.filter(i => i.innerText == this.currentPage)[0];
            let activeButton = activeLink.parentNode;
            activeButton.classList.add("active");

            let previousButton = document.querySelector('.page-item.previous-button');
            let nextButton = document.querySelector('.page-item.next-button');
            this.currentPage == 1 ? previousButton.classList.add('disabled') : previousButton.classList.remove('disabled');
            this.currentPage == this.pageCount ? nextButton.classList.add('disabled') : nextButton.classList.remove('disabled');
        }
    }

    RefreshData(pageNumber = 1){
        this.currentPage = pageNumber;
        document.dispatchEvent(this.pageChangedEvent);
    }
}