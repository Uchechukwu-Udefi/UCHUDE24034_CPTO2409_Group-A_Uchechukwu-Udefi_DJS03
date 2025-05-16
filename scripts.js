import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

let page = 1;
let matches = books


//Book Preview Element
/**
 * Create a data preview button element with book titles, images and authors.
 * @param {Object} book - A book object with author, id, image, and title.
 * @returns {HTMLElement} - A button element representing the book. 
 */

/*
function bookPreviewElement({ author, id, image, title }) {
    const element = document.createElement('button')
    element.classList = 'preview'
    element.setAttribute('data-preview', id)

    element.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `

    return element
}
    */

class BookPreview extends HTMLElement {

    static get observedAttributes() {
        return ['id', 'image', 'title', 'author'];
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const id = this.getAttribute('id');
        const image = this.getAttribute('image');
        const title = this.getAttribute('title');
        const authorId = this.getAttribute('author');
        const authorName = authors[authorId] || 'Unknown Author';

        this.shadowRoot.innerHTML = `
            <style>
                
.preview {
  border-width: 0;
  width: 100%;
  font-family: Roboto, sans-serif;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  text-align: left;
  border-radius: 8px;
  border: 1px solid rgba(var(--color-dark), 0.15);
  background: rgba(var(--color-light), 1);
}

@media (min-width: 60rem) {
  .preview {
    padding: 1rem;
  }
}

.preview_hidden {
  display: none;
}

.preview:hover {
  background: rgba(var(--color-blue), 0.05);
}

.preview__image {
  width: 48px;
  height: 70px;
  object-fit: cover;
  background: grey;
  border-radius: 2px;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
}

.preview__info {
  padding: 1rem;
}

.preview__title {
  margin: 0 0 0.5rem;
  font-weight: bold;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  color: rgba(var(--color-dark), 0.8)
}

.preview__author {
  color: rgba(var(--color-dark), 0.4);
}
            </style>
            <button class="preview" data-preview="${id}">
                <img class="preview__image" src="${image}" alt="${title}" />
                <div class="preview__info">
                    <h3 class="preview__title">${title}</h3>
                    <div class="preview__author">${authorName}</div>
                </div>
            </button>
        `;
    }
    

}

customElements.define('book-preview', BookPreview);

/**
 * Render the book list by appending book preview elements to the list.
 * @param {Array} booksToRender - An array of book objects.
 * @param {HTMLElement} container - The container element to append the book previews to.
 */

function renderBooks(booksToRender, container) {
    const starting = document.createDocumentFragment()

    
    for (const book of booksToRender) {
        const element = bookPreviewElement(book)
        starting.appendChild(element)
    }




    container.appendChild(starting)
}

renderBooks(matches.slice(0, BOOKS_PER_PAGE), document.querySelector('[data-list-items]'));

/**
 * Populates a dropdown menu with options.
 * @param {Object} options - Key-value pairs for the dropdown.
 * @param {HTMLElement} container - The dropdown element.
 * @param {string} defaultText - The default option text.
 */
function populateDropdown(options, container, defaultText) {
    const fragment = document.createDocumentFragment();
    const defaultOption = document.createElement('option');
    defaultOption.value = 'any';
    defaultOption.innerText = defaultText;
    fragment.appendChild(defaultOption);

    for (const [id, name] of Object.entries(options)) {
        const option = document.createElement('option');
        option.value = id;
        option.innerText = name;
        fragment.appendChild(option);
    }

    container.appendChild(fragment);
}

populateDropdown(genres, document.querySelector('[data-search-genres]'), 'All Genres');
populateDropdown(authors, document.querySelector('[data-search-authors]'), 'All Authors');


/**
 * Sets the theme based on the user's preference or settings.
 * @param {string} theme - 'day' or 'night'
 */

function setTheme(theme) {
    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
    document.querySelector('[data-settings-theme]').value = theme;
}

const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(prefersDark ? 'night' : 'day');

document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`

//--------------------------------- Event Listners -----------------------------------

document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false
})

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
})

document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true 
    document.querySelector('[data-search-title]').focus()
})

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true 
})

document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false
})

// Event listener for the settings form submission to set the theme.
// It prevents the default form submission behavior, retrieves the selected theme from the form data, and applies it using the setTheme function.

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    setTheme(theme);
    
    document.querySelector('[data-settings-overlay]').open = false
    
})

// Event listener for the search form submission to filter and display books based on user input.
// It prevents the default form submission behavior, retrieves the form data, and filters the books based on title, author, and genre.

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre)

        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;

        if (
            titleMatch && authorMatch && genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    const listMessage = document.querySelector('[data-list-message]')
    if (result.length < 1) {
        listMessage.classList.add('list__message_show')
    } else {
        listMessage.classList.remove('list__message_show')
    }

    const listContainer = document.querySelector('[data-list-items]')
    listContainer.innerHTML = '';
    renderBooks(result.slice(0, BOOKS_PER_PAGE), listContainer)

    listButton.disabled = result.length <= BOOKS_PER_PAGE
    listButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${Math.max(matches.length - (page * BOOKS_PER_PAGE), 0)})</span>
    `;

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false

})

// Event listener for the "Show more" button to load more book previews.
// It increments the page number and appends more book previews to the list until all books are displayed.
document.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment()

    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        fragment.appendChild(element)
    }

    document.querySelector('[data-list-items]').appendChild(fragment)
    page += 1
})

// Event listener for for displaying the book details in a modal when a book preview button is clicked.
document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (node?.dataset?.preview) {
            active = books.find(book => book.id === node.dataset.preview);
            break;
        }
    }
    
    if (active) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = active.image
        document.querySelector('[data-list-image]').src = active.image
        document.querySelector('[data-list-title]').innerText = active.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = active.description
    }
})