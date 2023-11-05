const bookList = document.querySelector('.book-list');
const addButton = document.querySelector('#addBook');
const counters = document.querySelectorAll('#total, #read');

let userLibrary = [
    new Book(
        'Harry Potter',
        'J.K. Rowling',
        870,
        'read'
    ),
    new Book(
        'The Chalice of the Gods',
        'Rick Riordan',
        256,
        'not read'
    )
];

makeList(); /* remove */

// Book object
function Book(title, author, pages, status='not read') {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
}

Book.prototype.toggleReadStatus = function() {
    this.status = this.status === 'read' ? 'not read' : 'read';
}

// Update book list
bookList.addEventListener('click', event => {
    const target = event.target;

    // Buttons are identified using classes
    if (target.classList.contains('read-toggle')) {
        toggleReadStatusOnButton(target);
    } else if (target.classList.contains('remove-book')) {
        removeBook(target);
    }
});

function toggleReadStatusOnButton(button) {
    // First parentNode is buttons div, the next is the card
    const bookIndex = button.parentNode.parentNode.getAttribute('data-attribute');
    const status = userLibrary[bookIndex].status;
    if (status === 'read') {
        button.classList.remove('read');
        button.textContent = 'Mark as Read';
    } else {
        button.classList.add('read');
        button.textContent = 'Mark as Unread';
    }

    userLibrary[bookIndex].toggleReadStatus();
    updateCounters();
}

function removeBook(button) {
    // First parentNode is buttons div, the next is the card
    const bookCard = button.parentNode.parentNode;
    const bookIndex = bookCard.getAttribute('data-attribute');

    // Remove that book from library
    delete userLibrary[bookIndex];
    bookList.removeChild(bookCard);
    updateCounters();
}

function updateCounters() {
    counters[0].querySelector('span').textContent = userLibrary.reduce((count, book) => {
        return book !== undefined ? count + 1 : count;
    }, 0);
    counters[1].querySelector('span').textContent = userLibrary.reduce((count, book) => {
        return book.status === 'read' ? count + 1 : count;
    }, 0);
}

// Add books
addButton.addEventListener('click', event => {
    if (!checkForm()) {
        return;
    }

    const title = document.querySelector('#book-title');
    const author = document.querySelector('#book-author');
    const pages = document.querySelector('#book-pages');
    const readStatus = document.querySelector('#read-status');

    addBookToLibrary(title.value, author.value, pages.value, readStatus.checked === true ? 'read' : 'not read');

    title.value = '';
    author.value = '';
    pages.value = '';
    readStatus.checked = false;
});

document.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
    input.addEventListener('keyup', () => {
        checkInput(input);
    });
});


// Checks the whole forms
function checkForm() {
    const inputs = document.querySelectorAll('input');
    let isErrorFree = true;

    for (input of inputs) {
        returnedValue = checkInput(input, isErrorFree);

        // Only change its value if it is false
        isErrorFree = returnedValue === false ? returnedValue : isErrorFree;
    }

    return isErrorFree;
}

// Validates only one input at a time
function checkInput(input, isErrorFree=true) {
    const errorNode = input.parentNode.querySelector('p.error');

    if (!input.checkValidity() && input.id === 'book-pages') {
        errorNode.innerHTML =
        `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>alert-circle</title><path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>
            Please provide a value between 1 and 100000!
        `
        isErrorFree = false;
    } else if (!input.checkValidity() || input.value.trim() === '') {
        errorNode.innerHTML =
        `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>alert-circle</title><path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>
            This is a required field!
        `
        isErrorFree = false;
    } else {
        errorNode.innerHTML = '';
    }

    return isErrorFree;
}

// Adds book after user input
function addBookToLibrary(title='unknown title', author='unknown', pages=0, status='not read') {
    if (!['read', 'not read'].includes(status)) {
        status = 'not read';
    }
    const book = new Book(title, author, pages, status);

    const newBookIndex = userLibrary.push(book) - 1;
    addBookCard(newBookIndex);
    updateCounters();
}

function makeList() {
    for (bookIndex in userLibrary) {
        if (userLibrary[bookIndex] === undefined) {
            continue;
        }
        addBookCard(bookIndex);
        updateCounters();
    }
}

function addBookCard(bookIndex) {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book');
    bookCard.setAttribute('data-attribute', bookIndex);

    const bookTitle = document.createElement('h3');
    bookTitle.classList.add('title');
    bookTitle.textContent = userLibrary[bookIndex].title;

    const bookAuthor = createCardPart('Author: ', userLibrary[bookIndex].author);
    const bookPages = createCardPart('Number of Pages: ', userLibrary[bookIndex].pages);
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');
    infoDiv.appendChild(bookAuthor);
    infoDiv.appendChild(bookPages)

    const bookStatus = document.createElement('button');
    bookStatus.classList.add('read-toggle');
    if (userLibrary[bookIndex].status === 'read') {
        bookStatus.classList.add('read');
        bookStatus.textContent = 'Mark As Unread';
    } else {
        bookStatus.textContent = 'Mark as Read';
    }

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-book');
    removeButton.textContent = 'Remove';

    const buttons = document.createElement('div');
    buttons.classList.add('buttons');
    buttons.appendChild(bookStatus);
    buttons.appendChild(removeButton);

    bookCard.appendChild(bookTitle);
    bookCard.appendChild(bookAuthor);
    bookCard.appendChild(bookPages);
    bookCard.appendChild(buttons);

    bookList.appendChild(bookCard);
}

function createCardPart(headerContent, mainContent) {
    const div = document.createElement('div');
    const header = document.createElement('h4');
    header.textContent = headerContent;
    div.appendChild(header);
    const mainContentText = document.createTextNode(mainContent);
    div.appendChild(mainContentText);
    return div;
}
