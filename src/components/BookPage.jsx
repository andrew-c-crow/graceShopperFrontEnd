import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBook } from "../api/books";
import { addBookToCart, deleteBookFromCart, saveLocalCart, updateBookQuantity } from "../api/carts";
import {EditBookForm, DeleteBookButton} from "./"


const BookPage = ({ user, cart, setCart }) => {
    const [book, setBook] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [readyToEdit, setReadyToEdit] = useState(false)
    const [indexInCart, setIndexInCart] = useState(-1)
    const {itemId} = useParams()


    useEffect(() => {
        async function callGetBook() {
            const bookData = await getBook(itemId)
            if (bookData) {
                const newIndexInCart = cart.items.findIndex((elem) => elem.itemId === bookData.id)
                console.log(newIndexInCart);
                setIndexInCart(newIndexInCart)
                setBook(bookData)
            }
        }
        callGetBook()
    },[cart])

    async function handleAdd(event) {
        event.preventDefault()

        if (cart.userId) {
            if (indexInCart === -1) {
                const newCartItem = await addBookToCart({cartId: cart.id, itemId: book.id, quantity})
                const newCart = {...cart}
                newCart.items = [...cart.items]
                newCart.items.push(newCartItem)
                setCart(newCart)
            } else {
                const newQuantity = cart.items[indexInCart].quantity + Number(quantity)
                const newCartItem = await updateBookQuantity({cartItemId: cart.items[indexInCart].id, quantity: newQuantity})
                const newCart = {...cart}
                newCart.items = [...cart.items]
                newCart.items[indexInCart].quantity = newCartItem.quantity
                setCart(newCart)
            }
        } else {
            if (indexInCart === -1) {
                const newCartItem = {...book, itemId: book.id, quantity: Number(quantity)}
                delete newCartItem.id
                const newCart = {...cart}
                newCart.items = [...cart.items]
                newCart.items.push(newCartItem)
                setCart(newCart)
                saveLocalCart(newCart)
            } else {
                const newCart = {...cart}
                newCart.items = [...cart.items]
                newCart.items[indexInCart].quantity += Number(quantity)
                setCart(newCart)
                saveLocalCart(newCart)
            }
        }
    }

    async function handleDelete(event) {
        event.preventDefault()

        if (user.id) {
            await deleteBookFromCart(cart.items[indexInCart].id)
            const newCart = {...cart}
            newCart.items = cart.items.filter((_, index) => index != indexInCart)
            setIndexInCart(-1)
            setCart(newCart)
        } else {
            const newCart = {...cart}
            newCart.items = cart.items.filter((_, index) => index != indexInCart)
            setIndexInCart(-1)
            setCart(newCart)
            saveLocalCart(newCart)
        }
    }

   

    return (
        <div className="book_page">
            {book ? 
                <>
                    <h1>{book.title} <small>{book.author}</small></h1>
                    <div>
                        <img src={book.imageURL} />
                        <div className="next_to_picture">
                            <p>${book.price/100}</p>
                            {indexInCart !== -1 ? <p>Quantity in Cart: {cart.items[indexInCart].quantity}</p> : null}
                            <input type='number' min="1" value={quantity} onChange={(elem) => setQuantity(elem.target.value)}/>
                            <button onClick={handleAdd}>Add to 🛒</button>
                            {indexInCart !== -1 ?
                                <button onClick={handleDelete}>🗑️</button>
                            : null}
                                
                            {cart.userId == 1 ?
                                <button onClick={() => {setReadyToEdit(!readyToEdit)}}>Admin Edit</button>
                            : null}
                            {readyToEdit ?
                                <EditBookForm book={book} setBook={setBook} setReady={setReadyToEdit}/>
                            : null}
                            {/* {cart.userId ==1 ?
                            <DeleteBookButton book={book} setBook={setBook}/>
                            : null} */}
                        </div>
                    </div>
                    <p>{book.description}</p>
                </>
            : null}
        </div>
    )

}

export default BookPage