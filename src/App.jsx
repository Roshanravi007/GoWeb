import React, { useMemo, useState } from "react";

const categories = [
  "Electronics",
  "Kitchen Accessories",
  "Plants",
  "Fish Tank",
  "Machinery Tools",
  "Plastics",
  "Medicine",
  "Bike Accessories",
  "Car Accessories",
  "Food"
];

const products = [
  {
    id: "123",
    name: "iPhone 15",
    category: "Electronics",
    price: 69999,
    oldPrice: 79999,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=900&q=85",
    desc: "Powerful smartphone with a bright Super Retina display, excellent cameras and all-day battery life."
  },
  {
    id: "124",
    name: "Sony Wireless Headphones",
    category: "Electronics",
    price: 8999,
    oldPrice: 11999,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    desc: "Immersive wireless audio with comfortable earcups and long battery life."
  },
  {
    id: "201",
    name: "Ceramic Kitchen Set",
    category: "Kitchen Accessories",
    price: 2499,
    oldPrice: 3299,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=85",
    desc: "Modern everyday kitchen essentials designed for durable, convenient use."
  },
  {
    id: "301",
    name: "Indoor Monstera Plant",
    category: "Plants",
    price: 899,
    oldPrice: 1199,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=900&q=85",
    desc: "A lush indoor plant that adds a fresh, natural look to your living space."
  },
  {
    id: "401",
    name: "Aqua Glass Fish Tank",
    category: "Fish Tank",
    price: 3499,
    oldPrice: 4299,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=900&q=85",
    desc: "Clear aquarium tank for creating a beautiful home aquatic environment."
  },
  {
    id: "501",
    name: "Cordless Power Drill",
    category: "Machinery Tools",
    price: 4299,
    oldPrice: 5499,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=85",
    desc: "Compact cordless drill for home projects, repairs and workshop tasks."
  },
  {
    id: "601",
    name: "Heavy Duty Storage Box",
    category: "Plastics",
    price: 799,
    oldPrice: 999,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=85",
    desc: "Stackable storage solution for keeping household items organised."
  },
  {
    id: "701",
    name: "Wellness Essentials Pack",
    category: "Medicine",
    price: 1299,
    oldPrice: 1599,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=85",
    desc: "A convenient collection of everyday wellness essentials."
  },
  {
    id: "801",
    name: "Bike Phone Mount",
    category: "Bike Accessories",
    price: 699,
    oldPrice: 899,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85",
    desc: "Secure handlebar phone mount for navigation and hands-free riding."
  },
  {
    id: "901",
    name: "Car Cleaning Kit",
    category: "Car Accessories",
    price: 1199,
    oldPrice: 1499,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=900&q=85",
    desc: "Practical car-care kit for keeping your vehicle clean inside and out."
  },
  {
    id: "1001",
    name: "Premium Snack Box",
    category: "Food",
    price: 599,
    oldPrice: 799,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=900&q=85",
    desc: "A curated snack box for work breaks, travel and family sharing."
  }
];

const addressesSeed = [
  {
    id: 1,
    label: "Home",
    text: "Adambakkam, Chennai, Tamil Nadu 600088",
    default: true
  },
  {
    id: 2,
    label: "Office",
    text: "Guindy, Chennai, Tamil Nadu 600032",
    default: false
  }
];

const defaultWishlists = {
  A: ["123", "201"],
  B: ["123", "501"],
  C: ["301"]
};

const STORAGE_KEY = "goweb-prototype-state-v12";

function loadGoWebState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function normalizeCart(cart) {
  if (!Array.isArray(cart)) return [];

  const map = new Map();

  cart.forEach(item => {
    if (!item || !item.id) return;

    const quantity = Math.max(1, Number(item.quantity) || 1);

    if (map.has(item.id)) {
      map.get(item.id).quantity += quantity;
    } else {
      map.set(item.id, { ...item, quantity });
    }
  });

  return [...map.values()];
}

function normalizeMergedLists(mergedLists, mergedContents, wishlists) {
  const resultLists = [];
  const resultContents = {};

  const sourceLists = Array.isArray(mergedLists) ? mergedLists : [];

  sourceLists.forEach(key => {
    if (!/^[ABC][ABC]$/.test(key) || key[0] === key[1]) return;

    const a = key[0];
    const b = key[1];

    const stored = Array.isArray(mergedContents?.[key])
      ? mergedContents[key]
      : [...new Set([...(wishlists[a] || []), ...(wishlists[b] || [])])];

    const valid = [...new Set(stored)].filter(id => {
      return products.some(p => p.id === id);
    });

    if (valid.length) {
      resultLists.push(key);
      resultContents[key] = valid;
    }
  });

  return {
    mergedLists: [...new Set(resultLists)],
    mergedContents: resultContents
  };
}

function Icon({ name, size = 20 }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    cart: (
      <>
        <circle cx="9" cy="20" r="1" />
        <circle cx="19" cy="20" r="1" />
        <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    back: <path d="m15 18-6-6 6-6" />,
    heart: <path d="M20.8 8.7c0 5.4-8.8 10.1-8.8 10.1S3.2 14.1 3.2 8.7A4.7 4.7 0 0 1 12 6a4.7 4.7 0 0 1 8.8 2.7Z" />,
    list: (
      <>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </>
    ),
    orders: (
      <>
        <path d="M6 2h12v20H6z" />
        <path d="M9 6h6M9 10h6M9 14h4" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    minus: <path d="M5 12h14" />
  };

  return <svg {...p}>{paths[name]}</svg>;
}

function QuantitySelector({ value, onChange, compact = false }) {
  const quantity = Math.max(1, Number(value) || 1);

  return (
    <div className={`quantityBox ${compact ? "compact" : ""}`}>
      <label>Quantity</label>
      <select value={quantity} onChange={e => onChange(Number(e.target.value))}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}

function Header({
  onNavigate,
  onSearch,
  addresses,
  setAddress,
  selectedAddress,
  cartCount
}) {
  const headerRef = React.useRef(null);
  const [addressOpen, setAddressOpen] = useState(false);
  const [allOpen, setAllOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [query, setQuery] = useState("");

  React.useEffect(() => {
    const close = e => {
      if (!headerRef.current?.contains(e.target)) {
        setAddressOpen(false);
        setAllOpen(false);
        setAccountOpen(false);
        setLangOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const go = (view, param = null) => {
    setAddressOpen(false);
    setAllOpen(false);
    setAccountOpen(false);
    setLangOpen(false);
    onNavigate(view, param);
  };

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();

    return products
      .filter(p => `${p.name} ${p.category}`.toLowerCase().includes(q))
      .slice(0, 5);
  }, [query]);

  return (
    <header className="header" ref={headerRef}>
      <div className="topbar">
        <button className="logo" onClick={() => go("home")}>
          Go<span>Web</span>
        </button>

        <div className="addressWrap">
          <button className="navItem addressBtn" onClick={() => setAddressOpen(v => !v)}>
            <Icon name="pin" size={22} />
            <div>
              <small>Deliver to</small>
              <strong>{selectedAddress.label}</strong>
            </div>
            <Icon name="chevron" size={15} />
          </button>

          {addressOpen && (
            <div className="popover addressPopover">
              <div className="popTitle">Choose a delivery address</div>

              {addresses.map(a => (
                <button
                  className={`addressChoice ${a.id === selectedAddress.id ? "selected" : ""}`}
                  key={a.id}
                  onClick={() => {
                    setAddress(a);
                    setAddressOpen(false);
                  }}
                >
                  <div>
                    <b>{a.label}</b>
                    {a.default && <span className="pill">DEFAULT</span>}
                    <p>{a.text}</p>
                  </div>
                  {a.id === selectedAddress.id && <Icon name="check" size={19} />}
                </button>
              ))}

              <button
                className="addAddress"
                onClick={() => {
                  const text = prompt("Enter the new delivery address");

                  if (text) {
                    setAddress({
                      id: Date.now(),
                      label: "New Address",
                      text,
                      default: false
                    });
                    setAddressOpen(false);
                  }
                }}
              >
                <Icon name="plus" size={17} />
                Add a new address
              </button>
            </div>
          )}
        </div>

        <div className="searchArea">
          <button className="allBtn" onClick={() => setAllOpen(v => !v)}>
            All <Icon name="chevron" size={14} />
          </button>

          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onSearch(query)}
            placeholder="Search GoWeb"
          />

          <button className="searchBtn" onClick={() => onSearch(query)}>
            <Icon name="search" size={21} />
          </button>

          {allOpen && (
            <div className="popover categoryPopover">
              <div className="popTitle">Shop by category</div>

              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => {
                    go("category", c);
                    setAllOpen(false);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {!!suggestions.length && (
            <div className="suggestions">
              {suggestions.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    go("product", p.id);
                    setQuery("");
                  }}
                >
                  <img src={p.image} alt="" />
                  <span>
                    {p.name}
                    <small>{p.category}</small>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="navDrop">
          <button className="navItem langBtn" onClick={() => setLangOpen(v => !v)}>
            <span className="flag">🇮🇳</span>
            <strong>EN</strong>
            <Icon name="chevron" size={14} />
          </button>

          {langOpen && (
            <div className="popover langPopover">
              {[
                "English",
                "हिन्दी",
                "தமிழ்",
                "తెలుగు",
                "বাংলা",
                "मराठी",
                "ગુજરાતી",
                "ಕನ್ನಡ",
                "മലയാളം",
                "ਪੰਜਾਬੀ",
                "اردو"
              ].map(l => (
                <button key={l} onClick={() => setLangOpen(false)}>
                  🇮🇳 {l}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="accountWrap">
          <button className="navItem textNav" onClick={() => setAccountOpen(v => !v)}>
            <div>
              <small>Hello, Roshan</small>
              <strong>Account & Lists</strong>
            </div>
            <Icon name="chevron" size={14} />
          </button>

          {accountOpen && (
            <div className="popover accountPopover">
              <div className="accountCols">
                <div>
                  <h4>List</h4>
                  <button onClick={() => go("wishlist")}>Wishlist</button>
                  <button onClick={() => go("merge")}>Merge List</button>
                </div>

                <div>
                  <h4>Account</h4>
                  <button onClick={() => go("account")}>Your Account</button>
                  <button onClick={() => setAccountOpen(false)}>Sign out</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <button className="navItem ordersNav" onClick={() => go("orders")}>
          <div>
            <small>Returns</small>
            <strong>& Orders</strong>
          </div>
        </button>

        <button className="cartNav" onClick={() => go("cart")}>
          <span className="cartIcon">
            <Icon name="cart" size={29} />
            <b>{cartCount}</b>
          </span>
          <strong>Cart</strong>
        </button>
      </div>
    </header>
  );
}

function ProductCard({ p, onProduct, onCart, onWish, onWishlist }) {
  const [wish, setWish] = useState("");
  const [quantity, setQuantity] = useState(1);

  return (
    <article className="productCard">
      <button className="productImageBtn" onClick={() => onProduct(p.id)}>
        <img src={p.image} alt={p.name} />
      </button>

      <div className="productInfo">
        <div className="rating">
          ★ {p.rating} <span>·</span> {Math.floor(p.rating * 1000)} ratings
        </div>

        <button className="productName" onClick={() => onProduct(p.id)}>
          {p.name}
        </button>

        <div className="price">
          ₹{p.price.toLocaleString("en-IN")}{" "}
          <del>₹{p.oldPrice.toLocaleString("en-IN")}</del>
        </div>

        <div className="delivery">FREE Delivery</div>

        <div className="cardActions">
          <QuantitySelector value={quantity} onChange={setQuantity} compact />

          <select
            value={wish}
            onChange={e => {
              setWish(e.target.value);

              if (e.target.value) {
                onWish(p, e.target.value);
                onWishlist?.();
              }
            }}
            aria-label="Add to wishlist"
          >
            <option value="">Add to List</option>
            <option>Wishlist A</option>
            <option>Wishlist B</option>
            <option>Wishlist C</option>
          </select>

          <button
            type="button"
            className="miniCart"
            onClick={() => onCart(p, quantity)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

function Home({ onNavigate, onCart, onWish }) {
  return (
    <main>
      <section className="hero">
        <div className="heroCopy">
          <span className="eyebrow">GO FURTHER. SHOP SMARTER.</span>
          <h1>
            Everything you need.
            <br />
            <em>One GoWeb.</em>
          </h1>
          <p>
            Discover products across India, from everyday essentials to
            specialist tools.
          </p>
        </div>

        <div className="heroVisual">
          <div className="heroCircle">
            Go<span>Web</span>
          </div>
          <div className="floatingCard">
            ⚡ Today’s picks
            <br />
            <b>Up to 30% off</b>
          </div>
        </div>
      </section>

      <section className="movingProducts">
        <div className="movingLabel">TRENDING NOW</div>

        <div className="movingTrack">
          {[...products.slice(0, 5), ...products.slice(0, 5)].map((p, i) => (
            <button
              className="movingProduct"
              key={p.id + i}
              onClick={() => onNavigate("product", p.id)}
            >
              <img src={p.image} alt="" />
              <span>
                <small>{p.category}</small>
                <b>{p.name}</b>
                <strong>₹{p.price.toLocaleString("en-IN")}</strong>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">EXPLORE</span>
            <h2>Shop by category</h2>
          </div>
        </div>

        <div className="categoryGrid">
          {categories.map((c, i) => (
            <button key={c} onClick={() => onNavigate("category", c)}>
              <span className="categoryIcon">
                {["📱", "🍳", "🌿", "🐠", "🛠️", "📦", "💊", "🏍️", "🚗", "🍱"][i]}
              </span>
              <b>{c}</b>
              <span>Shop now →</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section featured">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">FEATURED</span>
            <h2>Popular across GoWeb</h2>
          </div>

          <button
            className="linkBtn"
            onClick={() => onNavigate("category", "Electronics")}
          >
            See all →
          </button>
        </div>

        <div className="productGrid">
          {products.map(p => (
            <ProductCard
              key={p.id}
              p={p}
              onProduct={id => onNavigate("product", id)}
              onCart={onCart}
              onWish={onWish}
              onWishlist={() => onNavigate("wishlist")}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function Category({ category, onNavigate, onCart, onWish }) {
  const list = products.filter(p => p.category === category);

  return (
    <main className="page">
      <button className="backBtn" onClick={() => onNavigate("home")}>
        <Icon name="back" size={18} /> Back to GoWeb
      </button>

      <div className="pageTitle">
        <span className="eyebrow">CATEGORY</span>
        <h1>{category}</h1>
        <p>
          {list.length} product{list.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="productGrid">
        {list.map(p => (
          <ProductCard
            key={p.id}
            p={p}
            onProduct={id => onNavigate("product", id)}
            onCart={onCart}
            onWish={onWish}
            onWishlist={() => onNavigate("wishlist")}
          />
        ))}
      </div>
    </main>
  );
}

function ProductPage({ p, onBack, onCart }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <main className="page">
      <button className="backBtn" onClick={onBack}>
        <Icon name="back" size={18} /> Back
      </button>

      <div className="productPage">
        <div className="detailImage">
          <img src={p.image} alt={p.name} />
        </div>

        <div className="detailInfo">
          <span className="eyebrow">{p.category}</span>
          <h1>{p.name}</h1>

          <div className="bigRating">
            ★ {p.rating} <span>· 1,240 ratings</span>
          </div>

          <p className="detailDesc">{p.desc}</p>

          <div className="detailPrice">
            ₹{p.price.toLocaleString("en-IN")}{" "}
            <del>₹{p.oldPrice.toLocaleString("en-IN")}</del>
          </div>

          <p className="delivery">
            <b>FREE Delivery</b> · In stock
          </p>

          <QuantitySelector value={quantity} onChange={setQuantity} />

          <div className="detailActions">
            <button className="primary" onClick={() => onCart(p, quantity)}>
              Add to Cart
            </button>

            <button className="secondary" onClick={() => onCart(p, quantity)}>
              Buy Now
            </button>
          </div>

          <div className="trust">
            ✓ Secure payments &nbsp; ✓ Easy returns &nbsp; ✓ Genuine products
          </div>
        </div>
      </div>
    </main>
  );
}

function Wishlist({
  wishlists,
  setWishlists,
  mergedLists,
  setMergedLists,
  mergedContents,
  setMergedContents,
  onNavigate,
  onCart
}) {
  const [mergeOpen, setMergeOpen] = useState(false);

  const addWishlistItemToCart = (p, listKey, quantity) => {
    setWishlists(w => ({
      ...w,
      [listKey]: (w[listKey] || []).filter(id => id !== p.id)
    }));

    onCart(p, quantity);
  };

  const deleteWishlistItem = (id, listKey) => {
    setWishlists(w => ({
      ...w,
      [listKey]: (w[listKey] || []).filter(x => x !== id)
    }));
  };

  const createMerge = (a, b) => {
    const key = a + b;
    const ids = [...new Set([...(wishlists[a] || []), ...(wishlists[b] || [])])];

    if (!ids.length) {
      alert("Both wishlists are empty.");
      return;
    }

    setMergedContents(m => ({
      ...(m || {}),
      [key]: ids
    }));

    setMergedLists(m => [...new Set([...(m || []), key])]);

    setMergeOpen(false);
    onNavigate("merge", key);
  };

  return (
    <main className="page">
      <div className="pageTitle split">
        <div>
          <span className="eyebrow">YOUR LISTS</span>
          <h1>Wishlist</h1>
        </div>

        <button className="primary small" onClick={() => setMergeOpen(true)}>
          Merge List
        </button>
      </div>

      <div className="wishColumns">
        {["A", "B", "C"].map(k => (
          <WishlistColumn
            key={k}
            listKey={k}
            items={wishlists[k] || []}
            onCart={addWishlistItemToCart}
            onDelete={deleteWishlistItem}
          />
        ))}
      </div>

      {mergeOpen && (
        <div className="modalShade">
          <div className="modal">
            <button className="close" onClick={() => setMergeOpen(false)}>
              <Icon name="close" />
            </button>

            <h2>Create Merge List</h2>

            <p>
              Choose two wishlists to combine. Duplicate Product IDs are
              automatically removed.
            </p>

            <div className="mergeOptions">
              {[
                ["A", "B"],
                ["A", "C"],
                ["B", "C"]
              ].map(([a, b]) => (
                <button key={a + b} onClick={() => createMerge(a, b)}>
                  Wishlist {a} + Wishlist {b}
                  <Icon name="arrow" size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function WishlistColumn({ listKey, items, onCart, onDelete }) {
  const [quantities, setQuantities] = useState({});

  const setQuantity = (id, value) => {
    setQuantities(q => ({ ...q, [id]: value }));
  };

  return (
    <section className="wishCol">
      <h3>Wishlist {listKey}</h3>

      <div className="wishItems">
        {items.length ? (
          items.map(id => {
            const p = products.find(x => x.id === id);
            if (!p) return null;

            const quantity = quantities[id] || 1;

            return (
              <div className="wishItem" key={id}>
                <img src={p.image} alt={p.name} />

                <div>
                  <b>{p.name}</b>
                  <span>₹{p.price.toLocaleString("en-IN")}</span>

                  <QuantitySelector
                    value={quantity}
                    onChange={value => setQuantity(p.id, value)}
                    compact
                  />

                  <div className="listActions">
                    <button onClick={() => onCart(p, listKey, quantity)}>
                      Add to Cart
                    </button>

                    <button
                      className="deleteBtn"
                      onClick={() => onDelete(p.id, listKey)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="empty">No products in this list.</p>
        )}
      </div>
    </section>
  );
}

function Merge({
  pair,
  wishlists,
  mergedLists,
  setMergedLists,
  mergedContents,
  setMergedContents,
  onNavigate,
  onCart
}) {
  const savedMerges = Array.isArray(mergedLists) ? mergedLists : [];

  const requestedPair =
    typeof pair === "string" && /^[ABC][ABC]$/.test(pair) ? pair : null;

  const selectedPair =
    requestedPair && savedMerges.includes(requestedPair)
      ? requestedPair
      : savedMerges.length
      ? savedMerges[savedMerges.length - 1]
      : null;

  const a = selectedPair ? selectedPair[0] : null;
  const b = selectedPair ? selectedPair[1] : null;

  const ids = selectedPair
    ? [...new Set(mergedContents?.[selectedPair] || [])]
    : [];

  const removeFromMerge = id => {
    if (!selectedPair) return;

    const current = [...(mergedContents?.[selectedPair] || [])];
    const remaining = current.filter(x => x !== id);

    if (remaining.length) {
      setMergedContents(m => ({
        ...(m || {}),
        [selectedPair]: remaining
      }));
      return;
    }

    setMergedContents(m => {
      const next = { ...(m || {}) };
      delete next[selectedPair];
      return next;
    });

    setMergedLists(savedMerges.filter(k => k !== selectedPair));

    const nextPair = savedMerges.find(k => k !== selectedPair);

    onNavigate("merge", nextPair || null);
  };

  const addMergedItemToCart = (p, quantity) => {
    removeFromMerge(p.id);
    onCart(p, quantity);
  };

  return (
    <main className="page">
      <section className="savedMerges mergeWindowLists">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">SAVED MERGE LISTS</span>
            <h2>Your Merged Lists</h2>
            <p>
              Each merge is saved independently from Wishlist A, B and C.
            </p>
          </div>
        </div>

        {savedMerges.length ? (
          <div className="mergeHistory">
            {savedMerges.map(key => (
              <button
                className={`savedMergeCard ${
                  key === selectedPair ? "active" : ""
                }`}
                key={key}
                onClick={() => onNavigate("merge", key)}
              >
                <b>
                  Wishlist {key[0]} + Wishlist {key[1]}
                </b>
                <span>
                  {key === selectedPair
                    ? "Currently open"
                    : "Open merged list →"}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="noMergedLists">
            <h3>No Merged lists</h3>
            <p>
              No merge lists have been created yet. Go to Wishlist and choose
              two lists to create a merge.
            </p>
          </div>
        )}
      </section>

      {selectedPair ? (
        <>
          <button className="backBtn" onClick={() => onNavigate("wishlist")}>
            <Icon name="back" size={18} /> Back to Wishlist
          </button>

          <div className="pageTitle">
            <span className="eyebrow">MERGED LIST</span>
            <h1>
              Wishlist {a} + Wishlist {b}
            </h1>
            <p>
              {ids.length} unique product{ids.length !== 1 ? "s" : ""} ·
              duplicates automatically removed by Product ID
            </p>
          </div>

          {ids.length ? (
            <div className="mergedGrid">
              {ids.map(id => {
                const p = products.find(x => x.id === id);
                if (!p) return null;

                return (
                  <MergedItem
                    key={id}
                    p={p}
                    onDelete={() => removeFromMerge(p.id)}
                    onCart={addMergedItemToCart}
                  />
                );
              })}
            </div>
          ) : (
            <div className="emptyPanel">
              <h2>This Merge List is empty</h2>
              <p>
                When all products are removed, this merge option is
                automatically removed from Your Merged Lists.
              </p>
              <button
                className="primary"
                onClick={() => onNavigate("wishlist")}
              >
                Back to Wishlist
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="emptyPanel mergeEmptyState">
          <h2>No Merged lists</h2>
          <p>
            Create a merge from Wishlist A+B, A+C, or B+C. Your saved merge
            lists will appear here.
          </p>
          <button
            className="primary"
            onClick={() => onNavigate("wishlist")}
          >
            Go to Wishlist
          </button>
        </div>
      )}
    </main>
  );
}

function MergedItem({ p, onDelete, onCart }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="mergedItem">
      <img src={p.image} alt={p.name} />

      <div>
        <span className="sku">Product ID: {p.id}</span>
        <h3>{p.name}</h3>
        <b>₹{p.price.toLocaleString("en-IN")}</b>

        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          compact
        />

        <div className="mergeActions">
          <button
            className="miniCart"
            onClick={() => onCart(p, quantity)}
          >
            Add to Cart
          </button>

          <button className="deleteBtn" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Orders() {
  const orders = [
    ["GW-20260901-124", "iPhone 15", "₹69,999", "Delivered"],
    ["GW-20260825-911", "Cordless Power Drill", "₹4,299", "Shipped"],
    ["GW-20260817-402", "Premium Snack Box", "₹599", "Cancelled"]
  ];

  return (
    <main className="page">
      <div className="pageTitle">
        <span className="eyebrow">PURCHASE HISTORY</span>
        <h1>Your Orders</h1>
      </div>

      <div className="orders">
        {orders.map(o => (
          <div className="order" key={o[0]}>
            <div className="orderTop">
              <b>Order {o[0]}</b>
              <span>{o[3]}</span>
            </div>

            <div className="orderBody">
              <div>
                <h3>{o[1]}</h3>
                <p>{o[2]}</p>
              </div>

              <div className="timeline">
                <i className={o[3] !== "Cancelled" ? "done" : ""}>
                  Ordered
                </i>

                <i
                  className={
                    ["Shipped", "Delivered"].includes(o[3]) ? "done" : ""
                  }
                >
                  Shipped
                </i>

                <i className={o[3] === "Delivered" ? "done" : ""}>
                  Delivered
                </i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function Cart({ cart, onRemove, onQuantity, onNavigate, onPay }) {
  const safeCart = normalizeCart(cart);

  const total = safeCart.reduce(
    (sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 1),
    0
  );

  const totalUnits = safeCart.reduce(
    (sum, p) => sum + (Number(p.quantity) || 1),
    0
  );

  return (
    <main className="page">
      <div className="pageTitle">
        <span className="eyebrow">YOUR BAG</span>
        <h1>Shopping Cart</h1>
        <p>
          {safeCart.length} product{safeCart.length !== 1 ? "s" : ""} ·{" "}
          {totalUnits} item{totalUnits !== 1 ? "s" : ""}
        </p>
      </div>

      {safeCart.length ? (
        <div className="cartLayout">
          <div className="cartItems">
            {safeCart.map(p => (
              <div className="cartItem" key={p.id}>
                <img src={p.image} alt={p.name} />

                <div className="cartMain">
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>

                  <b>
                    ₹{p.price.toLocaleString("en-IN")} each
                  </b>

                  <QuantitySelector
                    value={p.quantity}
                    onChange={value => onQuantity(p.id, value)}
                  />

                  <div className="cartLineTotal">
                    Item total:{" "}
                    <strong>
                      ₹
                      {(p.price * p.quantity).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <button
                    className="deleteBtn"
                    onClick={() => onRemove(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="summary">
            <span>Subtotal</span>
            <h2>₹{total.toLocaleString("en-IN")}</h2>
            <p>FREE delivery available</p>

            <button className="primary" onClick={onPay}>
              Proceed to pay
            </button>
          </aside>
        </div>
      ) : (
        <div className="emptyPanel">
          <div className="emptyIcon">🛒</div>
          <h2>Your cart is empty</h2>

          <button className="primary" onClick={() => onNavigate("home")}>
            Continue shopping
          </button>
        </div>
      )}
    </main>
  );
}

function Payment({ total, onNavigate }) {
  const [method, setMethod] = useState("UPI");

  return (
    <main className="page narrow">
      <button className="backBtn" onClick={() => onNavigate("cart")}>
        <Icon name="back" size={18} /> Back to cart
      </button>

      <div className="pageTitle">
        <span className="eyebrow">CHECKOUT</span>
        <h1>Payment</h1>
      </div>

      <div className="payment">
        <div>
          <h3>Pay securely</h3>

          {[
            "UPI",
            "Card (Debit or Credit)",
            "Net Banking",
            "Cash on Delivery"
          ].map(m => (
            <button
              className={`payMethod ${method === m ? "active" : ""}`}
              key={m}
              onClick={() => setMethod(m)}
            >
              <span>{method === m ? "●" : "○"}</span>
              {m}
            </button>
          ))}

          {method === "UPI" && (
            <input placeholder="Enter UPI ID (e.g. name@bank)" />
          )}

          {method.startsWith("Card") && (
            <>
              <input placeholder="Card number" />
              <div className="two">
                <input placeholder="MM / YY" />
                <input placeholder="CVV" />
              </div>
            </>
          )}

          {method === "Net Banking" && (
            <select>
              <option>Select your bank</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>SBI</option>
              <option>Axis Bank</option>
            </select>
          )}
        </div>

        <aside className="summary">
          <span>Total payable</span>
          <h2>₹{total.toLocaleString("en-IN")}</h2>

          <button
            className="primary"
            onClick={() => alert("Demo payment successful! Order placed.")}
          >
            Place order
          </button>
        </aside>
      </div>
    </main>
  );
}

function Account() {
  const links = [
    ["Your Orders", "Track, return or review purchases"],
    ["Contact Us", "Get help with orders and GoWeb services"],
    ["GoWeb Pay Balance", "View your available wallet balance"],
    ["Payment Options", "Manage UPI, cards and net banking"],
    ["Delivery Addresses", "Add or update saved delivery locations"],
    ["Login & Security", "Manage email, password and account security"],
    [
      "Request your data",
      "Request a copy of your personal data",
      "https://www.amazon.in/hz/privacy-central/data-requests/preview.html"
    ],
    [
      "Data Access and Requests",
      "Review data access and privacy requests",
      "https://www.amazon.in/privacy-center/data-access"
    ],
    [
      "Manage apps and services with data access",
      "Control connected apps and services",
      "https://www.amazon.in/ap/adam?ref_=ya_d_l_iba"
    ],
    [
      "Close Your Amazon Account",
      "Data deletion and account closure",
      "https://www.amazon.in/privacy/data-deletion"
    ],
    [
      "Privacy Notice",
      "Read the privacy notice",
      "https://www.amazon.in/gp/help/customer/display.html?nodeId=201909010"
    ]
  ];

  return (
    <main className="page">
      <div className="pageTitle">
        <span className="eyebrow">ACCOUNT</span>
        <h1>Your Account</h1>
        <p>Manage your GoWeb profile, payments, orders and data.</p>
      </div>

      <div className="accountPanel expandedAccount">
        <div className="accountIdentity">
          <Icon name="user" size={30} />
          <h3>Roshan</h3>
          <p>Welcome back. Manage your GoWeb account from one place.</p>
        </div>

        {links.map(([title, desc, url]) => (
          <div className="accountFeature" key={title}>
            <b>{title}</b>
            <p>{desc}</p>

            {url ? (
              <a href={url} target="_blank" rel="noreferrer">
                Open privacy page →
              </a>
            ) : (
              <button>Manage →</button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default function App() {
  const saved = React.useMemo(() => loadGoWebState(), []);

  const initialWishlists = saved.wishlists || defaultWishlists;
  const initialCart = normalizeCart(saved.cart || []);

  const initialMergeState = normalizeMergedLists(
    saved.mergedLists || [],
    saved.mergedContents || {},
    initialWishlists
  );

  const [view, setView] = useState("home");
  const [param, setParam] = useState(null);

  const [addresses, setAddresses] = useState(
    saved.addresses || addressesSeed
  );

  const [selectedAddress, setSelectedAddress] = useState(
    saved.selectedAddress ||
      (saved.addresses || addressesSeed)[0]
  );

  const [cart, setCart] = useState(initialCart);

  const [wishlists, setWishlists] = useState(initialWishlists);

  const [mergedLists, setMergedLists] = useState(
    initialMergeState.mergedLists
  );

  const [mergedContents, setMergedContents] = useState(
    initialMergeState.mergedContents
  );

  const navigate = (v, p = null) => {
    setView(v);
    setParam(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /*
   * CART LOGIC
   *
   * One Product ID = one cart row.
   * Repeated Add to Cart clicks increase quantity instead of
   * creating duplicate rows.
   */
  const addCart = (product, quantity = 1) => {
    if (!product) return;

    const qty = Math.max(1, Number(quantity) || 1);

    setCart(current => {
      const existing = current.find(p => p.id === product.id);

      if (existing) {
        return current.map(p =>
          p.id === product.id
            ? { ...p, quantity: (Number(p.quantity) || 1) + qty }
            : p
        );
      }

      return [...current, { ...product, quantity: qty }];
    });

    navigate("cart");
  };

  const updateCartQuantity = (id, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);

    setCart(current =>
      current.map(p =>
        p.id === id ? { ...p, quantity: qty } : p
      )
    );
  };

  const removeCart = id => {
    setCart(current => current.filter(p => p.id !== id));
  };

  /*
   * WISHLIST LOGIC
   */
  const addWish = (p, listName) => {
    if (!p || !listName) return;

    const listKey = listName.slice(-1);

    setWishlists(current => ({
      ...current,
      [listKey]: [...new Set([...(current[listKey] || []), p.id])]
    }));
  };

  /*
   * IMPORTANT:
   * If a product is deleted from Wishlist A/B/C,
   * remove it from every relevant merged list.
   *
   * Example:
   * A+B contains 123
   * A+C contains 123
   * Delete 123 from A
   * -> 123 disappears from A+B and A+C
   * -> B+C remains unaffected.
   */
  React.useEffect(() => {
    setMergedContents(current => {
      let changed = false;
      const next = { ...(current || {}) };

      Object.keys(next).forEach(key => {
        const a = key[0];
        const b = key[1];

        const allowed = new Set([
          ...(wishlists[a] || []),
          ...(wishlists[b] || [])
        ]);

        const filtered = (next[key] || []).filter(id =>
          allowed.has(id)
        );

        if (!filtered.length) {
          delete next[key];
          changed = true;
          return;
        }

        if (filtered.length !== (next[key] || []).length) {
          next[key] = filtered;
          changed = true;
        }
      });

      return changed ? next : current;
    });
  }, [wishlists]);

  /*
   * Keep saved merge-list names synchronized with their contents.
   * This is intentionally the ONLY place that removes a merge
   * because its contents became empty.
   */
  React.useEffect(() => {
    setMergedLists(current => {
      const contentKeys = Object.keys(mergedContents || {});
      const valid = (current || []).filter(key =>
        contentKeys.includes(key)
      );

      return [...new Set(valid)];
    });
  }, [mergedContents]);

  /*
   * PERSIST EVERYTHING.
   *
   * The previous version omitted mergedLists and mergedContents
   * from this dependency array. That could make B+C disappear
   * after a refresh. v12 saves all state together.
   */
  React.useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        addresses,
        selectedAddress,
        cart,
        wishlists,
        mergedLists,
        mergedContents
      })
    );
  }, [
    addresses,
    selectedAddress,
    cart,
    wishlists,
    mergedLists,
    mergedContents
  ]);

  const total = cart.reduce(
    (sum, p) =>
      sum + (Number(p.price) || 0) * (Number(p.quantity) || 1),
    0
  );

  const search = q => {
    const text = q.trim().toLowerCase();

    if (!text) return;

    const p = products.find(p =>
      `${p.name} ${p.category}`.toLowerCase().includes(text)
    );

    if (p) {
      navigate("product", p.id);
    } else {
      alert(`No demo product found for "${q}"`);
    }
  };

  const handleAddress = address => {
    setSelectedAddress(address);

    setAddresses(current =>
      current.some(x => x.id === address.id)
        ? current
        : [...current, address]
    );
  };

  return (
    <div className="app">
      <Header
        onNavigate={navigate}
        onSearch={search}
        addresses={addresses}
        setAddress={handleAddress}
        selectedAddress={selectedAddress}
        cartCount={cart.reduce(
          (sum, p) => sum + (Number(p.quantity) || 1),
          0
        )}
      />

      {view === "home" && (
        <Home
          onNavigate={navigate}
          onCart={addCart}
          onWish={addWish}
        />
      )}

      {view === "category" && (
        <Category
          category={param}
          onNavigate={navigate}
          onCart={addCart}
          onWish={addWish}
        />
      )}

      {view === "product" && (
        <ProductPage
          p={products.find(p => p.id === param) || products[0]}
          onBack={() => navigate("home")}
          onCart={addCart}
        />
      )}

      {view === "wishlist" && (
        <Wishlist
          wishlists={wishlists}
          setWishlists={setWishlists}
          mergedLists={mergedLists}
          setMergedLists={setMergedLists}
          mergedContents={mergedContents}
          setMergedContents={setMergedContents}
          onNavigate={navigate}
          onCart={addCart}
        />
      )}

      {view === "merge" && (
        <Merge
          pair={param}
          wishlists={wishlists}
          mergedLists={mergedLists}
          setMergedLists={setMergedLists}
          mergedContents={mergedContents}
          setMergedContents={setMergedContents}
          onNavigate={navigate}
          onCart={addCart}
        />
      )}

      {view === "orders" && <Orders />}

      {view === "cart" && (
        <Cart
          cart={cart}
          onRemove={removeCart}
          onQuantity={updateCartQuantity}
          onNavigate={navigate}
          onPay={() => navigate("payment")}
        />
      )}

      {view === "payment" && (
        <Payment total={total} onNavigate={navigate} />
      )}

      {view === "account" && <Account />}

      <footer>
        <b>
          Go<span>Web</span>
        </b>
        <span>Shop across India · Built as a functional prototype</span>
        <span>© 2026 GoWeb</span>
      </footer>
    </div>
  );
}
