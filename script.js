const bookList = document.querySelector('.book-list');
const addButton = document.querySelector('#addBook');
const counters = document.querySelectorAll('#total, #read');

let userLibrary = [
    new Book(
        'Very Short Title',
        'asdioajdgasdjkakdkadqwidqwsadadasjdasdgaskdhkasdhasdasdasjdhasdjhdjascjajckasduiasdhaoidhaduasdhasuhda',
        6969,
        'read'
    ),
    new Book(
        'Very Short Title',
        'a',
        24,
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
    userLibrary = userLibrary.slice(0, bookIndex).concat(userLibrary.slice(bookIndex + 1));
    bookList.removeChild(bookCard);
    updateCounters();
}

function updateCounters() {
    counters[0].querySelector('span').textContent = userLibrary.length;
    counters[1].querySelector('span').textContent = userLibrary.reduce((count, book) => {
        return book.status === 'read' ? count + 1 : count;
    }, 0);
}

// Add books
addButton.addEventListener('click', event => {
    if (!checkInput()) {
        return;
    }
});

function checkInput() {
    const inputs = document.querySelectorAll('input');
    for (input of inputs) {
        const errorNode = input.parentNode.querySelector('p.error');
        if (input.id === 'book-pages') {
            errorNode.textContent = '*Please enter a valid page number between 1 and 100000';
        } else if (!input.checkValidity() || input.value.trim() === '') {
            errorNode.textContent = '*This is a required field!';
        } else {
            errorNode.textContent = '';
        }
    }
}

// Adds book after user input
function addBookToLibrary(title='unknown title', author='unknown', pages=0, status='not read') {
    if (!['read', 'not read'].includes(status)) {
        status = 'not read';
    }
    const book = new Book(title, author, pages, status);

    const newBookIndex = userLibrary.push(book) - 1;
}

function makeList() {
    for (bookIndex in userLibrary) {
        addBookCard(bookIndex);
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
    const span = document.createElement('span');
    const header = document.createElement('h4');
    header.textContent = headerContent;
    span.appendChild(header);
    const mainContentText = document.createTextNode(mainContent);
    span.appendChild(mainContentText);
    return span;
}
