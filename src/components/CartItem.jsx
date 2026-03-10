// =============================================
// CartItem.jsx — Clean minimal cart row
// =============================================

function CartItem({ item, onUpdate, onRemove }) {
    const lineTotal = (item.price * item.quantity).toFixed(2)

    return (
        <div className="flex items-center gap-5 p-4 bg-white rounded-xl border border-gray-100 mb-3 font-sans hover:shadow-sm transition-all">
            {/* Image + Info */}
            <div className="flex items-center gap-4 flex-[2] min-w-0">
                <div className="w-16 h-16 rounded-xl bg-[#F3F3F3] flex items-center justify-center p-2 shrink-0">
                    <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain"
                        onError={(e) => { e.target.src = 'https://placehold.co/64/f3f3f3/999?text=?' }} />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.title}</p>
                    <p className="text-xs text-gray-500">Rs.{item.price.toLocaleString()} each</p>
                </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
                <button className="w-7 h-7 rounded-md bg-white border border-gray-100 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-100 transition-colors text-sm" onClick={() => onUpdate(item._id, item.quantity - 1)}>−</button>
                <span className="text-sm font-bold text-gray-900 min-w-[20px] text-center">{item.quantity}</span>
                <button className="w-7 h-7 rounded-md bg-white border border-gray-100 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-100 transition-colors text-sm" onClick={() => onUpdate(item._id, item.quantity + 1)}>+</button>
            </div>

            {/* Total */}
            <span className="font-bold text-sm text-gray-900 min-w-[80px] text-right">
                Rs.{Number(lineTotal).toLocaleString()}
            </span>

            {/* Remove */}
            <button className="text-gray-300 hover:text-red-500 transition-colors p-1" onClick={() => onRemove(item._id)} title="Remove">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    )
}

export default CartItem
