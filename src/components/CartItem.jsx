import React, { useReducer, useState } from "react"
import { deleteBookFromCart, saveLocalCart, updateBookQuantity } from "../api/carts"
import Book from "./Book"
import { NavLink } from "react-router-dom"
const CartItem = ({ elem, cart, user, setCart }) => {
    const [quantity, setQuantity] = useState(elem.quantity)
    
    const indexInCart = cart.items.findIndex((book) => book.itemId == elem.itemId)
    const outOfStock = (cart.items[indexInCart].numInStock - cart.items[indexInCart].quantity) < 0

    async function handleDelete(event) {
        event.preventDefault()
        const unwantedBook = cart.items[indexInCart].id
        if (cart && user.id) {
            const deletedBook = await deleteBookFromCart(unwantedBook)
            const newCart = { ...cart }
            newCart.items = cart.items.filter((book) => book.itemId !== deletedBook.itemId)
            setCart(newCart)
        } else {
            const newCart = { ...cart }
            newCart.items = cart.items.filter((book) => book.itemId !== elem.itemId)
            setCart(newCart)
            saveLocalCart(newCart)
        }
    }

    async function handleOnChange(event) {
        event.preventDefault()
        if (quantity > 0) {
            if (cart.userId) {
                await updateBookQuantity({
                    cartItemId: cart.items[indexInCart].id,
                    quantity: quantity
                })
                const updatedCart = { ...cart }
                updatedCart.items = [...cart.items]
                updatedCart.items[indexInCart].quantity = Number(quantity)
                setCart(updatedCart)
            } else {
                const updatedCart = { ...cart }
                updatedCart.items = [...cart.items]
                updatedCart.items[indexInCart].quantity = Number(quantity)
                setCart(updatedCart)
                saveLocalCart(updatedCart)
            }
        } else if (cart && user.id) {
            const unwantedBook = cart.items[indexInCart].id
            const deletedBook = await deleteBookFromCart(unwantedBook)
            const newCart = { ...cart }
            newCart.items = cart.items.filter((book) => book.itemId !== deletedBook.itemId)
            setCart(newCart)
        } else {
            const newCart = { ...cart }
            newCart.items = cart.items.filter((book) => book.itemId !== elem.itemId)
            setCart(newCart)
            saveLocalCart(newCart)
        }
    }

    return (
        <div className="cart_item">
            <div className="cart_img">
                <img src={elem.imageURL} />
                <div className="cart_book_info">
                    <NavLink className="cart_book_title" to={`/${elem.itemId}`}>{elem.title}</NavLink>
                    <h4>By: {elem.author}</h4>
                    <p className={outOfStock ? "out_of_stock" : "in_stock"}>In Stock: {elem.numInStock} {outOfStock ? '*NOT ENOUGH IN STOCK*' : null}</p>
                    <div className="cart_quantity_buttons">
                        <input
                            className="quantity_input"
                            type="number"
                            min="0"
                            value={quantity}
                            onChange={(e) => {
                                setQuantity(e.target.value)
                            }}
                        />
                        <button onClick={handleOnChange}>Update</button>
                        <button onClick={handleDelete}>
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </div>

                <div className="cart_price">
                    <p>${elem.price / 100}</p>
                </div>
            </div>
        </div>
    )
}

export default CartItem
