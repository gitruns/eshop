import { useEffect, useState } from 'react'
import axios from '../../api/axiosConfig'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/actions/cart-actions'

function ProductDetails() {
    const [product, setProduct] = useState({})
    // console.log(product)
    const dispatch = useDispatch()

    const { id } = useParams()
    const fetchData = () => {
        // axios.get('https://api.escuelajs.co/api/v1/products/' + id)
        axios.get('/api/products/' + id)
            .then(res => setProduct(res.data))
            .catch(err => console.error("Error fetching data:", err))
    }

    useEffect(() => {
        fetchData()
    }, [id])

    const onAddToCartHandler = () => {
        dispatch(addToCart(product))
    }

    return (
        <div className="container">
            <div className="row mt-5">
                <div className="col-6">
                    <div className="wrapper">
                        <img src={product.images} alt={product.productName} className="img-fluid" />
                    </div>
                </div>
                <div className="col-6">
                    <div className="wrapper">
                        <h2>{product.productName}</h2>
                        <span class="badge badge-secondary">{product?.category?.name}</span>
                        <p>{product.description}</p>
                        <div className="d-flex justify-content-between align-items-center">
                            <p className="card-text mb-0">${product.price}</p>
                            <button onClick={onAddToCartHandler} className="btn btn-primary">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails


// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useParams } from 'react-router-dom'
//
// function ProductDetails() {
//     const [product, setProduct] = useState({})
//     const [selected, setSelected] = useState(0)
//
//     const { id } = useParams()
//     const fetchData = () => {
//         axios
//             .get('https://api.escuelajs.co/api/v1/products/' + id)
//             .then(res => {
//                 setProduct(res.data)
//                 setSelected(0) // reset to first image on product load
//             })
//             .catch(err => console.error("Error fetching data:", err))
//     }
//
//     useEffect(() => {
//         fetchData()
//     }, [id])
//
//     const images = Array.isArray(product.images) ? product.images : product.images ? [product.images] : []
//     const mainSrc = images.length ? images[Math.min(selected, images.length - 1)] : ''
//
//     return (
//         <div className="container">
//             <div className="row mt-5">
//                 <div className="col-6">
//                     <div className="wrapper">
//                         {mainSrc ? (
//                             <img src={mainSrc} alt={product.title || 'Product'} className="img-fluid" />
//                         ) : (
//                             <div className="bg-light" style={{ height: 300 }} />
//                         )}
//                     </div>
//
//                     {images.length > 1 && (
//                         <div
//                             className="mt-3"
//                             style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}
//                         >
//                             {images.map((src, i) => (
//                                 <button
//                                     key={i}
//                                     onClick={() => setSelected(i)}
//                                     style={{
//                                         border: i === selected ? '2px solid #0d6efd' : '1px solid #ddd',
//                                         padding: 0,
//                                         background: 'transparent',
//                                         borderRadius: 4,
//                                         flex: '0 0 auto'
//                                     }}
//                                     aria-label={`Show image ${i + 1}`}
//                                 >
//                                     <img
//                                         src={src}
//                                         alt={`Thumbnail ${i + 1}`}
//                                         style={{ width: 64, height: 64, objectFit: 'cover', display: 'block', borderRadius: 3 }}
//                                     />
//                                 </button>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//
//                 <div className="col-6">
//                     <div className="wrapper">
//                         <h2>{product.title}</h2>
//                         <p>{product.description}</p>
//                         <div className="d-flex justify-content-between align-items-center">
//                             <p className="card-text mb-0">${product.price}</p>
//                             <a href="#" className="btn btn-primary">Add to Cart</a>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
//
// export default ProductDetails
//