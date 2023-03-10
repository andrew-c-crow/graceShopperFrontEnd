import React from 'react'
import { Outlet, Link } from 'react-router-dom';
import LoginForm from './LoginForm';


const Navbar = ({user, setUser, cart}) => {

    return (
        <div id='navbar'>
            <img  className="logo" src="https://res.cloudinary.com/fsa2/image/upload/v1670432399/Site%20Images/3_yg5x0d.png"/>
            <img className="logo_words" src="https://res.cloudinary.com/fsa2/image/upload/v1670433805/Site%20Images/new_aapj8j.png"/>
                
            <div className="navbar_box">
                <LoginForm user={user} setUser={setUser}/>
                <div className='nav_link_list'>
                    <Link to="/" className="nav_link">Home</Link>
                    <Link to="products" className="nav_link">Products</Link>
                    {user && user.id == 1 ? 
                        <Link to="admin" className="nav_link">Admin</Link> 
                    : null}
                    {user.id ? <Link className="nav_link" to="dashboard">My Account</Link> : null}
                    {cart.items.length ?
                        <Link to="cart" className="nav_link" id="cart_nav_link">
                            <span className="material-symbols-outlined">shopping_cart</span>
                            ({cart.items.length})
                        </Link>
                    : null} 
                </div>

            </div>
        </div>
    );
};

export default Navbar