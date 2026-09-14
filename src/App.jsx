// GoWeb deployment build
import React, { useMemo, useState } from "react";

const categories = [
  "Electronics","Kitchen Accessories","Plants","Fish Tank","Machinery Tools",
  "Plastics","Medicine","Bike Accessories","Car Accessories","Food"
];

const products = [
  {id:"123", name:"iPhone 15", category:"Electronics", price:69999, oldPrice:79999, rating:4.7, image:"https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=900&q=85", desc:"Powerful smartphone with a bright Super Retina display, excellent cameras and all-day battery life."},
  {id:"124", name:"Sony Wireless Headphones", category:"Electronics", price:8999, oldPrice:11999, rating:4.5, image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85", desc:"Immersive wireless audio with comfortable earcups and long battery life."},
  {id:"201", name:"Ceramic Kitchen Set", category:"Kitchen Accessories", price:2499, oldPrice:3299, rating:4.4, image:"https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=85", desc:"Modern everyday kitchen essentials designed for durable, convenient use."},
  {id:"301", name:"Indoor Monstera Plant", category:"Plants", price:899, oldPrice:1199, rating:4.6, image:"https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=900&q=85", desc:"A lush indoor plant that adds a fresh, natural look to your living space."},
  {id:"401", name:"Aqua Glass Fish Tank", category:"Fish Tank", price:3499, oldPrice:4299, rating:4.3, image:"https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=900&q=85", desc:"Clear aquarium tank for creating a beautiful home aquatic environment."},
  {id:"501", name:"Cordless Power Drill", category:"Machinery Tools", price:4299, oldPrice:5499, rating:4.6, image:"https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=85", desc:"Compact cordless drill for home projects, repairs and workshop tasks."},
  {id:"601", name:"Heavy Duty Storage Box", category:"Plastics", price:799, oldPrice:999, rating:4.2, image:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=85", desc:"Stackable storage solution for keeping household items organised."},
  {id:"701", name:"Wellness Essentials Pack", category:"Medicine", price:1299, oldPrice:1599, rating:4.5, image:"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=85", desc:"A convenient collection of everyday wellness essentials."},
  {id:"801", name:"Bike Phone Mount", category:"Bike Accessories", price:699, oldPrice:899, rating:4.4, image:"https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85", desc:"Secure handlebar phone mount for navigation and hands-free riding."},
  {id:"901", name:"Car Cleaning Kit", category:"Car Accessories", price:1199, oldPrice:1499, rating:4.6, image:"https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=900&q=85", desc:"Practical car-care kit for keeping your vehicle clean inside and out."},
  {id:"1001", name:"Premium Snack Box", category:"Food", price:599, oldPrice:799, rating:4.3, image:"https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=900&q=85", desc:"A curated snack box for work breaks, travel and family sharing."}
];

const addressesSeed = [
  {id:1,label:"Home",text:"Adambakkam, Chennai, Tamil Nadu 600088",default:true},
  {id:2,label:"Office",text:"Guindy, Chennai, Tamil Nadu 600032",default:false}
];

const STORAGE_KEY = "goweb-prototype-state-v10";
function loadGoWebState(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch(e) { return {}; }
}

function normalizeCart(items){
  const map = new Map();
  (Array.isArray(items) ? items : []).filter(Boolean).forEach(item => {
    const id = String(item.id);
    const existing = map.get(id);
    if(existing){ existing.quantity = Math.min(10, (Number(existing.quantity)||1) + (Number(item.quantity)||1)); }
    else { map.set(id, {...item, quantity: Math.min(10, Math.max(1, Number(item.quantity)||1))}); }
  });
  return Array.from(map.values());
}

function QuantitySelect({value,onChange,className="quantitySelect",compact=false}){
  return <label className={`quantityControl ${compact?"compact":""}`}><span>Quantity</span><select className={className} value={Number(value)||1} onChange={e=>onChange(Number(e.target.value))} aria-label="Quantity">{Array.from({length:10},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select></label>;
}

function Icon({name, size=20}) {
  const p = {width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"};
  const paths = {
    search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    cart:<><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6"/></>,
    pin:<><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    user:<><circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6"/></>,
    chevron:<path d="m6 9 6 6 6-6"/>,
    back:<><path d="m15 18-6-6 6-6"/></>,
    heart:<path d="M20.8 8.7c0 5.4-8.8 10.1-8.8 10.1S3.2 14.1 3.2 8.7A4.7 4.7 0 0 1 12 6a4.7 4.7 0 0 1 8.8 2.7Z"/>,
    list:<><path d="M4 6h16M4 12h16M4 18h16"/></>,
    orders:<><path d="M6 2h12v20H6z"/><path d="M9 6h6M9 10h6M9 14h4"/></>,
    close:<><path d="m6 6 12 12M18 6 6 18"/></>,
    plus:<><path d="M12 5v14M5 12h14"/></>,
    check:<path d="m5 12 4 4L19 6"/>,
    arrow:<path d="M5 12h14m-6-6 6 6-6 6"/>
  };
  return <svg {...p}>{paths[name]}</svg>;
}

function Header({onNavigate, onSearch, addresses, setAddress, selectedAddress, cartCount}) {
  const headerRef=React.useRef(null);
  const [addressOpen,setAddressOpen]=useState(false);
  const [allOpen,setAllOpen]=useState(false);
  const [accountOpen,setAccountOpen]=useState(false);
  const [langOpen,setLangOpen]=useState(false);
  const [query,setQuery]=useState("");
  React.useEffect(()=>{const close=e=>{if(headerRef.current&&!headerRef.current.contains(e.target)){setAddressOpen(false);setAllOpen(false);setAccountOpen(false);setLangOpen(false)}};document.addEventListener("mousedown",close);return()=>document.removeEventListener("mousedown",close)},[]);

  const go = (v,p=null) => { setAddressOpen(false); setAllOpen(false); setAccountOpen(false); setLangOpen(false); onNavigate(v,p); };

  const suggestions = useMemo(() => {
    if(!query.trim()) return [];
    const q=query.toLowerCase();
    return products.filter(p => `${p.name} ${p.category}`.toLowerCase().includes(q)).slice(0,5);
  },[query]);

  return <header className="header" ref={headerRef}>
    <div className="topbar">
      <button className="logo" onClick={()=>go("home")}>Go<span>Web</span></button>

      <div className="addressWrap">
        <button className="navItem addressBtn" onClick={()=>setAddressOpen(v=>!v)}>
          <Icon name="pin" size={22}/><div><small>Deliver to</small><strong>{selectedAddress.label}</strong></div><Icon name="chevron" size={15}/></button>
        {addressOpen && <div className="popover addressPopover">
          <div className="popTitle">Choose a delivery address</div>
          {addresses.map(a=><button className={"addressChoice "+(a.id===selectedAddress.id?"selected":"")} key={a.id} onClick={()=>{setAddress(a);setAddressOpen(false)}}><div><b>{a.label}</b>{a.default&&<span className="pill">DEFAULT</span>}<p>{a.text}</p></div>{a.id===selectedAddress.id&&<Icon name="check" size={19}/>}</button>)}
          <button className="addAddress" onClick={()=>{const text=prompt("Enter the new delivery address"); if(text){setAddress({...selectedAddress,id:Date.now(),label:"New Address",text,default:false}); setAddressOpen(false)}}}><Icon name="plus" size={17}/> Add a new address</button>
        </div>}
      </div>

      <div className="searchArea">
        <button className="allBtn" onClick={()=>setAllOpen(v=>!v)}>All <Icon name="chevron" size={14}/></button>
        <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onSearch(query)} placeholder="Search GoWeb" />
        <button className="searchBtn" onClick={()=>onSearch(query)}><Icon name="search" size={21}/></button>
        {allOpen && <div className="popover categoryPopover">
          <div className="popTitle">Shop by category</div>
          {categories.map(c=><button key={c} onClick={()=>{go("category",c);setAllOpen(false)}}>{c}</button>)}
        </div>}
        {!!suggestions.length && <div className="suggestions">{suggestions.map(p=><button key={p.id} onClick={()=>{go("product",p.id);setQuery("")}}><img src={p.image}/><span>{p.name}<small>{p.category}</small></span></button>)}</div>}
      </div>

      <div className="navDrop">
        <button className="navItem langBtn" onClick={()=>setLangOpen(v=>!v)}><span className="flag">🇮🇳</span><strong>EN</strong><Icon name="chevron" size={14}/></button>
        {langOpen&&<div className="popover langPopover">{["English","हिन्दी","தமிழ்","తెలుగు","বাংলা","मराठी","ગુજરાતી","ಕನ್ನಡ","മലയാളം","ਪੰਜਾਬੀ","اردو"].map(l=><button key={l} onClick={()=>setLangOpen(false)}>🇮🇳 {l}</button>)}</div>}
      </div>

      <div className="accountWrap">
        <button className="navItem textNav" onClick={()=>setAccountOpen(v=>!v)}><div><small>Hello, Roshan</small><strong>Account & Lists</strong></div><Icon name="chevron" size={14}/></button>
        {accountOpen&&<div className="popover accountPopover">
          <div className="accountCols">
            <div><h4>List</h4><button onClick={()=>{go("wishlist");setAccountOpen(false)}}>Wishlist</button><button onClick={()=>{go("merge");setAccountOpen(false)}}>Merge List</button></div>
            <div><h4>Account</h4><button onClick={()=>{go("account");setAccountOpen(false)}}>Your Account</button><button onClick={()=>setAccountOpen(false)}>Sign out</button></div>
          </div>
        </div>}
      </div>

      <button className="navItem ordersNav" onClick={()=>go("orders")}><div><small>Returns</small><strong>& Orders</strong></div></button>
      <button className="cartNav" onClick={()=>go("cart")}><span className="cartIcon"><Icon name="cart" size={29}/><b>{cartCount}</b></span><strong>Cart</strong></button>
    </div>
  </header>
}

function ProductCard({p,onProduct,onCart,onWish,onWishlist}) {
  const [wish,setWish]=useState("");
  const [quantity,setQuantity]=useState(1);
  return <article className="productCard">
    <button className="productImageBtn" onClick={()=>onProduct(p.id)}><img src={p.image} alt={p.name}/></button>
    <div className="productInfo">
      <div className="rating">★ {p.rating} <span>·</span> {Math.floor(p.rating*1000)} ratings</div>
      <button className="productName" onClick={()=>onProduct(p.id)}>{p.name}</button>
      <div className="price">₹{p.price.toLocaleString("en-IN")} <del>₹{p.oldPrice.toLocaleString("en-IN")}</del></div>
      <div className="delivery">FREE Delivery</div>
      <div className="cardActions">
        <QuantitySelect value={quantity} onChange={setQuantity}/>
        <select className="listSelect" value={wish} onChange={e=>{setWish(e.target.value);if(e.target.value){onWish(p,e.target.value);onWishlist&&onWishlist()}}} aria-label="Add to wishlist">
          <option value="">Add to List</option><option>Wishlist A</option><option>Wishlist B</option><option>Wishlist C</option>
        </select>
        <button type="button" className="miniCart" onClick={(e)=>{e.preventDefault();e.stopPropagation();onCart(p,quantity,true)}}>Add to Cart</button>
      </div>
    </div>
  </article>
}

function Home({onNavigate,onCart,onWish}) {
  return <main>
    <section className="hero">
      <div className="heroCopy"><span className="eyebrow">GO FURTHER. SHOP SMARTER.</span><h1>Everything you need.<br/><em>One GoWeb.</em></h1><p>Discover products across India, from everyday essentials to specialist tools.</p></div>
      <div className="heroVisual"><div className="heroCircle">Go<span>Web</span></div><div className="floatingCard">⚡ Today’s picks<br/><b>Up to 30% off</b></div></div>
    </section>
    <section className="movingProducts"><div className="movingLabel">TRENDING NOW</div><div className="movingTrack">{[...products.slice(0,5),...products.slice(0,5)].map((p,i)=><button className="movingProduct" key={p.id+i} onClick={()=>onNavigate("product",p.id)}><img src={p.image}/><span><small>{p.category}</small><b>{p.name}</b><strong>₹{p.price.toLocaleString("en-IN")}</strong></span></button>)}</div></section>
    <section className="section">
      <div className="sectionHead"><div><span className="eyebrow">EXPLORE</span><h2>Shop by category</h2></div></div>
      <div className="categoryGrid">{categories.map((c,i)=><button key={c} onClick={()=>onNavigate("category",c)}><span className="categoryIcon">{["📱","🍳","🌿","🐠","🛠️","📦","💊","🏍️","🚗","🍱"][i]}</span><b>{c}</b><span>Shop now →</span></button>)}</div>
    </section>
    <section className="section featured"><div className="sectionHead"><div><span className="eyebrow">FEATURED</span><h2>Popular across GoWeb</h2></div><button className="linkBtn" onClick={()=>onNavigate("category","Electronics")}>See all →</button></div>
      <div className="productGrid">{products.map(p=><ProductCard key={p.id} p={p} onProduct={id=>onNavigate("product",id)} onCart={onCart} onWish={onWish} onWishlist={()=>onNavigate("wishlist")}/>)}</div>
    </section>
  </main>
}

function Category({category,onNavigate,onCart,onWish}) {
  const list=products.filter(p=>p.category===category);
  return <main className="page"><button className="backBtn" onClick={()=>onNavigate("home")}><Icon name="back" size={18}/> Back to GoWeb</button><div className="pageTitle"><span className="eyebrow">CATEGORY</span><h1>{category}</h1><p>{list.length} product{list.length!==1?"s":""} available</p></div>
    <div className="productGrid">{list.map(p=><ProductCard key={p.id} p={p} onProduct={id=>onNavigate("product",id)} onCart={onCart} onWish={onWish} onWishlist={()=>onNavigate("wishlist")}/>)}</div>
  </main>
}

function ProductPage({p,onBack,onCart}) {
  const [quantity,setQuantity]=useState(1);
  return <main className="page"><button className="backBtn" onClick={onBack}><Icon name="back" size={18}/> Back</button><div className="productPage">
    <div className="detailImage"><img src={p.image} alt={p.name}/></div>
    <div className="detailInfo"><span className="eyebrow">{p.category}</span><h1>{p.name}</h1><div className="bigRating">★ {p.rating} <span>· 1,240 ratings</span></div><p className="detailDesc">{p.desc}</p><div className="detailPrice">₹{p.price.toLocaleString("en-IN")} <del>₹{p.oldPrice.toLocaleString("en-IN")}</del></div><p className="delivery"><b>FREE Delivery</b> · In stock</p><QuantitySelect value={quantity} onChange={setQuantity}/><div className="detailActions"><button className="primary" onClick={()=>onCart(p,quantity,true)}>Add to Cart</button><button className="secondary" onClick={()=>onCart(p,quantity,true)}>Buy Now</button></div><div className="trust">✓ Secure payments &nbsp; ✓ Easy returns &nbsp; ✓ Genuine products</div></div>
  </div></main>
}

function Wishlist({wishlists,setWishlists,onNavigate,onCart}) {
  const [mergeOpen,setMergeOpen]=useState(false);
  return <main className="page"><div className="pageTitle split"><div><span className="eyebrow">YOUR LISTS</span><h1>Wishlist</h1></div><button className="primary small" onClick={()=>setMergeOpen(true)}>Merge List</button></div>
    <div className="wishColumns">{["A","B","C"].map(k=><section className="wishCol" key={k}><h3>Wishlist {k}</h3><div className="wishItems">{wishlists[k].length?<>{wishlists[k].map(id=>{const p=products.find(x=>x.id===id);if(!p)return null;return <WishlistItem key={id} p={p} onCart={onCart} setWishlists={setWishlists} listKey={k}/>})}</>:<p className="empty">No products in this list.</p>}</div></section>)}</div>
    {mergeOpen&&<div className="modalShade"><div className="modal"><button className="close" onClick={()=>setMergeOpen(false)}><Icon name="close"/></button><h2>Merge List</h2><p>Choose two wishlists to combine. Duplicate product IDs will be shown only once.</p><div className="mergeOptions">{[["A","B"],["A","C"],["B","C"]].map(([a,b])=><button key={a+b} onClick={()=>{setMergeOpen(false);onNavigate("merge",a+b)}}>Wishlist {a} + Wishlist {b}<Icon name="arrow" size={18}/></button>)}</div></div></div>}
  </main>
}

function WishlistItem({p,onCart,setWishlists,listKey}){
  const [quantity,setQuantity]=useState(1);
  const add=()=>{setWishlists(w=>({...w,[listKey]:(w[listKey]||[]).filter(id=>id!==p.id)}));onCart(p,quantity,true)};
  const remove=()=>setWishlists(w=>({...w,[listKey]:(w[listKey]||[]).filter(id=>String(id)!==String(p.id))}));
  return <div className="wishItem"><img src={p.image} alt={p.name}/><div className="wishItemMain"><b>{p.name}</b><span>₹{p.price.toLocaleString("en-IN")}</span><div className="itemActions"><QuantitySelect value={quantity} onChange={setQuantity}/><button className="listActionBtn" onClick={add}>Add to Cart</button><button className="deleteBtn listDelete" onClick={remove}>Delete</button></div></div></div>;
}

function Merge({pair,wishlists,setWishlists,onNavigate,onCart}) {
  const selectedPair=typeof pair==="string" && pair.length>=2 ? pair : "AB";
  const a=selectedPair[0] || "A";
  const b=selectedPair[1] || "B";
  const ids=[...new Set([...(wishlists[a]||[]),...(wishlists[b]||[])])];
  return <main className="page"><button className="backBtn" onClick={()=>onNavigate("wishlist")}><Icon name="back" size={18}/> Back to Wishlist</button><div className="pageTitle"><span className="eyebrow">MERGED LIST</span><h1>Wishlist {a} + Wishlist {b}</h1><p>{ids.length} unique product{ids.length!==1?"s":""} · duplicates automatically removed by Product ID</p></div>
    {ids.length?<div className="mergedGrid">{ids.map(id=>{const p=products.find(x=>x.id===id); if(!p) return null; return <MergedItem key={id} p={p} a={a} b={b} setWishlists={setWishlists} onCart={onCart}/>})}</div>:<div className="emptyPanel">Your selected lists have no products yet.</div>}
  </main>
}

function MergedItem({p,a,b,setWishlists,onCart}){
  const [quantity,setQuantity]=useState(1);
  const add=()=>{setWishlists(w=>({...w,[a]:(w[a]||[]).filter(id=>String(id)!==String(p.id)),[b]:(w[b]||[]).filter(id=>String(id)!==String(p.id))}));onCart(p,quantity,true)};
  const remove=()=>setWishlists(w=>({...w,[a]:(w[a]||[]).filter(id=>String(id)!==String(p.id)),[b]:(w[b]||[]).filter(id=>String(id)!==String(p.id))}));
  return <div className="mergedItem"><img src={p.image} alt={p.name}/><div><span className="sku">Product ID: {p.id}</span><h3>{p.name}</h3><b>₹{p.price.toLocaleString("en-IN")}</b><div className="itemActions"><QuantitySelect value={quantity} onChange={setQuantity}/><button className="miniCart" onClick={add}>Add to Cart</button><button className="deleteBtn listDelete" onClick={remove}>Delete</button></div></div></div>;
}

function Orders() {
  const orders=[["GW-20260901-124","iPhone 15","₹69,999","Delivered"],["GW-20260825-911","Cordless Power Drill","₹4,299","Shipped"],["GW-20260817-402","Premium Snack Box","₹599","Cancelled"]];
  return <main className="page"><div className="pageTitle"><span className="eyebrow">PURCHASE HISTORY</span><h1>Your Orders</h1></div><div className="orders">{orders.map(o=><div className="order" key={o[0]}><div className="orderTop"><b>Order {o[0]}</b><span>{o[3]}</span></div><div className="orderBody"><div><h3>{o[1]}</h3><p>{o[2]}</p></div><div className="timeline"><i className={o[3]!=="Cancelled"?"done":""}>Ordered</i><i className={["Shipped","Delivered"].includes(o[3])?"done":""}>Shipped</i><i className={o[3]==="Delivered"?"done":""}>Delivered</i></div></div></div>)}</div></main>
}

function Cart({cart,onRemove,onQuantityChange,onNavigate,onPay}) {
  const safeCart=Array.isArray(cart)?cart.filter(Boolean):[];
  const total=safeCart.reduce((s,p)=>s+(Number(p.price)||0)*(Number(p.quantity)||1),0);
  const totalUnits=safeCart.reduce((s,p)=>s+(Number(p.quantity)||1),0);
  return <main className="page"><div className="pageTitle"><span className="eyebrow">YOUR BAG</span><h1>Shopping Cart</h1><p>{safeCart.length} unique item{safeCart.length!==1?"s":""} · {totalUnits} unit{totalUnits!==1?"s":""}</p></div>{safeCart.length?<div className="cartLayout"><div className="cartItems">{safeCart.map(p=><div className="cartItem" key={p.id}><img src={p.image}/><div className="cartMain"><h3>{p.name}</h3><p>{p.desc}</p><b>₹{p.price.toLocaleString("en-IN")} each</b><div className="cartControls"><QuantitySelect value={Number(p.quantity)||1} onChange={q=>onQuantityChange(p.id,q)}/><strong>Item total: ₹{((Number(p.price)||0)*(Number(p.quantity)||1)).toLocaleString("en-IN")}</strong><button className="deleteBtn" onClick={()=>onRemove(p.id)}>Delete</button></div></div></div>)}</div><aside className="summary"><span>Subtotal</span><h2>₹{total.toLocaleString("en-IN")}</h2><p>FREE delivery available</p><button className="primary" onClick={()=>onPay()}>Proceed to pay</button></aside></div>:<div className="emptyPanel"><div className="emptyIcon">🛒</div><h2>Your cart is empty</h2><button className="primary" onClick={()=>onNavigate("home")}>Continue shopping</button></div>}</main>
}

function Payment({total,onNavigate}) {
  const [method,setMethod]=useState("UPI");
  return <main className="page narrow"><button className="backBtn" onClick={()=>onNavigate("cart")}><Icon name="back" size={18}/> Back to cart</button><div className="pageTitle"><span className="eyebrow">CHECKOUT</span><h1>Payment</h1></div><div className="payment"><div><h3>Pay securely</h3>{["UPI","Card (Debit or Credit)","Net Banking","Cash on Delivery"].map(m=><button className={"payMethod "+(method===m?"active":"")} key={m} onClick={()=>setMethod(m)}><span>{method===m?"●":"○"}</span>{m}</button>)}{method==="UPI"&&<input placeholder="Enter UPI ID (e.g. name@bank)"/>}{method.startsWith("Card")&&<><input placeholder="Card number"/><div className="two"><input placeholder="MM / YY"/><input placeholder="CVV"/></div></>}{method==="Net Banking"&&<select><option>Select your bank</option><option>HDFC Bank</option><option>ICICI Bank</option><option>SBI</option><option>Axis Bank</option></select>}</div><aside className="summary"><span>Total payable</span><h2>₹{total.toLocaleString("en-IN")}</h2><button className="primary" onClick={()=>alert("Demo payment successful! Order placed.")}>Place order</button></aside></div></main>
}

function Account(){const links=[["Your Orders","Track, return or review purchases"],["Contact Us","Get help with orders and GoWeb services"],["GoWeb Pay Balance","View your available wallet balance"],["Payment Options","Manage UPI, cards and net banking"],["Delivery Addresses","Add or update saved delivery locations"],["Login & Security","Manage email, password and account security"],["Request your data","Request a copy of your personal data","https://www.amazon.in/hz/privacy-central/data-requests/preview.html"],["Data Access and Requests","Review data access and privacy requests","https://www.amazon.in/privacy-center/data-access"],["Manage apps and services with data access","Control connected apps and services","https://www.amazon.in/ap/adam?ref_=ya_d_l_iba"],["Close Your Amazon Account","Data deletion and account closure","https://www.amazon.in/privacy/data-deletion"],["Privacy Notice","Read the privacy notice","https://www.amazon.in/gp/help/customer/display.html?nodeId=201909010"]];return <main className="page"><div className="pageTitle"><span className="eyebrow">ACCOUNT</span><h1>Your Account</h1><p>Manage your GoWeb profile, payments, orders and data.</p></div><div className="accountPanel expandedAccount"><div className="accountIdentity"><Icon name="user" size={30}/><h3>Roshan</h3><p>Welcome back. Manage your GoWeb account from one place.</p></div>{links.map(([title,desc,url])=><div className="accountFeature" key={title}><b>{title}</b><p>{desc}</p>{url?<a href={url} target="_blank" rel="noreferrer">Open privacy page →</a>:<button>Manage →</button>}</div>)}</div></main>}

export default function App(){
  const [view,setView]=useState("home");
  const [param,setParam]=useState(null);
  const saved = React.useMemo(() => loadGoWebState(), []);
  const [addresses,setAddresses]=useState(saved.addresses || addressesSeed);
  const [selectedAddress,setSelectedAddress]=useState(saved.selectedAddress || (saved.addresses || addressesSeed)[0]);
  const [cart,setCart]=useState(()=>normalizeCart(saved.cart || []));
  const [wishlists,setWishlists]=useState(saved.wishlists || {A:["123","201"],B:["123","501"],C:["301"]});

  const navigate=(v,p=null)=>{setView(v);setParam(p);window.scrollTo({top:0,behavior:"smooth"})};
  const addCart=(p,quantity=1,buyNow=false)=>{
    if(!p) return;
    const qty=Math.min(10,Math.max(1,Number(quantity)||1));
    setCart(c=>{
      const next=normalizeCart(c);
      const index=next.findIndex(item=>String(item.id)===String(p.id));
      if(index>=0) next[index]={...next[index],quantity:Math.min(10,(Number(next[index].quantity)||1)+qty)};
      else next.push({...p,quantity:qty});
      return next;
    });
    navigate("cart");
  };
  const addWish=(p,list)=>setWishlists(w=>({...w,[list[ list.length-1] ]:[...new Set([...(w[list[list.length-1]]||[]),p.id])]}));
  const removeCart=id=>setCart(c=>c.filter(p=>String(p.id)!==String(id)));
  const updateCartQuantity=(id,quantity)=>setCart(c=>c.map(p=>String(p.id)===String(id)?{...p,quantity:Math.min(10,Math.max(1,Number(quantity)||1))}:p));
  const total=cart.reduce((s,p)=>s+(Number(p.price)||0)*(Number(p.quantity)||1),0);
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({addresses,selectedAddress,cart,wishlists}));
  }, [addresses,selectedAddress,cart,wishlists]);

  const search=(q)=>{const p=products.find(x=>`${x.name} ${x.category}`.toLowerCase().includes(q.toLowerCase())); if(p)navigate("product",p.id); else if(q)alert(`No demo product found for "${q}"`)};

  return <div className="app">
    <Header onNavigate={navigate} onSearch={search} addresses={addresses} setAddress={a=>{setSelectedAddress(a);setAddresses(xs=>xs.some(x=>x.id===a.id)?xs: [...xs,a])}} selectedAddress={selectedAddress} cartCount={cart.reduce((s,p)=>s+(Number(p.quantity)||1),0)}/>
    {view==="home"&&<Home onNavigate={navigate} onCart={addCart} onWish={addWish}/>}
    {view==="category"&&<Category category={param} onNavigate={navigate} onCart={addCart} onWish={addWish}/>}
    {view==="product"&&<ProductPage p={products.find(p=>p.id===param)||products[0]} onBack={()=>navigate("home")} onCart={addCart}/>}
    {view==="wishlist"&&<Wishlist wishlists={wishlists} setWishlists={setWishlists} onNavigate={navigate} onCart={addCart}/>}
    {view==="merge"&&<Merge pair={param||"AB"} wishlists={wishlists} setWishlists={setWishlists} onNavigate={navigate} onCart={addCart}/>}
    {view==="orders"&&<Orders/>}
    {view==="cart"&&<Cart cart={cart} onRemove={removeCart} onQuantityChange={updateCartQuantity} onNavigate={navigate} onPay={()=>navigate("payment")}/>}
    {view==="payment"&&<Payment total={total} onNavigate={navigate}/>}
    {view==="account"&&<Account/>}
    <footer><b>Go<span>Web</span></b><span>Shop across India · Built as a functional prototype</span><span>© 2026 GoWeb</span></footer>
  </div>
}
