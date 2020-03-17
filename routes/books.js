const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb)
{
  return async(req, res, next) => {
    try 
    {
      await cb(req, res, next)
    } 
    catch(error) // Catch error thrown
    {
      // send error to global error handler
      next(error);
    }
  }
}

/* GET Home route will redirect to books route. */
router.get('/', asyncHandler(async (req, res) => {
  
  // Request to SQL server for all the books
  const books = await Book.findAll();
  res.render("index", { books, title: "Library Books", header: "Books" });

}));

/* GET books route will show the list of books in the library route. */
router.get('/books', asyncHandler(async (req, res) => {
  
  // Request to SQL server for all the books
  const books = await Book.findAll();
  res.render("index", { books, title: "Library Books", header: "Books" }); 

}));

/* Create a new book form. */
router.get('/new', (req, res) => { 
  
  // display new-book view
  res.render("new-book", { book: {}, title: "New Book" });
  
});

/* POST create new book. */
router.post('/new', asyncHandler(async (req, res) => {

  // Try to see if we can create the book
  try 
  {
    console.log('attempting to create new book...');

    // Request to SQL server to create book, if successful show the created book
    const book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } 
  catch (error) 
  {
    // if creation fails and is due to validation error display error message to user
    if(error.name === "SequelizeValidationError") 
    {
      console.log('failed to create new book...');
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors, title: "New Book" })
    }
    else 
    {
      throw error;
    } 
  }
  
}));

/* GET individual book. */
router.get("/:id", asyncHandler(async (req, res) => {

    // Try to see if we can find the book in the database

    const book = await Book.findByPk(req.params.id);

    // if the book is found show the book to the user, else show a page-not-found view
    if(book) 
    {
      res.render("update-book", { book, title: book.title });  
    } 
    else 
    {
      // create custom error for non existant book id
      let myError = new Error('Book Not Found');
      myError.status = 500;
      throw myError; 
    }

}));

/* POST update a book. */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;

  // Try to see if we can update the book
  try 
  {
    console.log('attempting to update book...');

    // Request to SQL server to find the book
    book = await Book.findByPk(req.params.id);

    // if the book is found try to update with new information

    if(book) 
    {
      console.log('attempting to update book: ' + book.title);
      await  book.update(req.body);

      // if successful show the updated information

      res.render("update-book", {book, title: book.title, success: 1}); 
    } 
    else 
    {
      // show page not found view
      res.render("page-not-found", {title: "Page Not Found", header: "Page Not Found"});
    }
  } 
  catch (error) 
  {
    // if update fails and is due to validation error display error message to user
    console.log('failed to update book...');
    if(error.name === "SequelizeValidationError") 
    {
      book = await Book.findByPk(req.params.id);
      res.render("update-book", { book, errors: error.errors, title: book.title })
    } 
    else 
    {
      throw error;
    }
  }

}));

/* Delete individual book. */

router.post('/:id/delete', asyncHandler(async (req ,res) => {

  // request from server to see if we can get the book to delete
  const book = await Book.findByPk(req.params.id);

  // if book exists try to destroy if not show page not found
  if(book) 
  {
    await book.destroy();
    res.redirect("/books");
  } 
  else 
  {
    res.render("page-not-found", {title: "Page Not Found", header: "Page Not Found"});
  }
  
}));

// export router

module.exports = router;