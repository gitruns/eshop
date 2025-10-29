import Navbar from "../../components/Navbar"
import { useSelector } from "react-redux"
import EmptyCart from "../../components/Cart/EmptyCart"
import Cart from "../../components/Cart"

function CartPage() {
    const cart = useSelector(state => state.carts)

    return (
        <>
            <Navbar />

            {
                (cart.length === 0) ? <EmptyCart /> : <Cart />
            }
        </>
    )
}

export default CartPage