(() => {
  const cfg=window.STORE_CONFIG||{}, client=window.supabase?.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
  const $=id=>document.getElementById(id), grid=$("productGrid"), status=$("status"), search=$("searchInput");
  const cartKey="forma-wall-store-cart-v1";let products=[],activeCategory="All",cart=[];
  try{cart=JSON.parse(localStorage.getItem(cartKey)||"[]")}catch{cart=[]}
  const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(Number(n||0));
  function toast(t){const el=$("toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2300)}
  function saveCart(){localStorage.setItem(cartKey,JSON.stringify(cart));renderCart()}
  async function loadProducts(){
    if(!client){status.textContent="Supabase configuration is missing. Check config.js.";return}
    const {data,error}=await client.from("products").select("*").eq("is_active",true).order("created_at",{ascending:false});
    if(error){status.textContent="We couldn't load the collection: "+error.message;return}
    products=data||[];status.textContent=products.length?"": "The collection is waiting for its first pieces. Add products from Studio Admin.";
    renderProducts()
  }
  function renderProducts(){
    const q=(search.value||"").trim().toLowerCase();
    const shown=products.filter(p=>(activeCategory==="All"||(p.category||"Wall Posters")===activeCategory)&&(`${p.name||""} ${p.description||""}`).toLowerCase().includes(q));
    grid.innerHTML="";
    shown.forEach((p,i)=>{
      const card=document.createElement("article");card.className="product-card";
      const visual=document.createElement("div");visual.className="product-visual";
      const img=document.createElement("img");img.alt=p.name||"Wall art";img.loading="lazy";img.src=p.image_url||"";
      if(!p.image_url)visual.classList.add("no-image");
      img.onerror=()=>{img.remove();visual.classList.add("no-image")};visual.append(img);
      const tag=document.createElement("span");tag.className="product-tag";tag.textContent=p.category||"Wall Posters";visual.append(tag);
      const details=document.createElement("div");details.className="product-details";
      const name=document.createElement("h3");name.textContent=p.name||"Untitled artwork";
      const desc=document.createElement("p");desc.textContent=p.description||"A considered piece for your space.";
      const foot=document.createElement("div");foot.className="product-card-foot";
      const price=document.createElement("strong");price.textContent=money(p.price);
      const add=document.createElement("button");add.className="add-button";add.textContent="Add to bag +";add.onclick=()=>addToCart(p);
      foot.append(price,add);details.append(name,desc,foot);card.append(visual,details);grid.append(card);
    });
    if(!shown.length&&products.length)status.textContent="No pieces match your search. Try another word or collection.";
  }
  function addToCart(p){const item=cart.find(x=>x.id===p.id);if(item)item.quantity++;else cart.push({id:p.id,name:p.name,price:Number(p.price),quantity:1});saveCart();toast("Added to your bag")}
  function renderCart(){
    $("cartCount").textContent=cart.reduce((s,x)=>s+x.quantity,0);const items=$("cartItems");items.innerHTML="";
    if(!cart.length){items.innerHTML='<div class="empty-bag"><span>♡</span><p>Your bag is waiting for something lovely.</p></div>'}
    cart.forEach(item=>{
      const row=document.createElement("div");row.className="cart-row";const info=document.createElement("div");info.className="cart-row-info";
      const name=document.createElement("strong");name.textContent=item.name;const price=document.createElement("span");price.textContent=money(item.price)+" · Qty "+item.quantity;info.append(name,price);
      const controls=document.createElement("div");controls.className="quantity-controls";
      const minus=document.createElement("button");minus.textContent="−";minus.onclick=()=>{item.quantity--;if(item.quantity<1)cart=cart.filter(x=>x.id!==item.id);saveCart()};
      const plus=document.createElement("button");plus.textContent="+";plus.onclick=()=>{item.quantity++;saveCart()};controls.append(minus,plus);row.append(info,controls);items.append(row);
    });
    $("cartTotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.quantity,0));
  }
  function toggleCart(open){$("cartDrawer").classList.toggle("open",open);$("cartBackdrop").classList.toggle("show",open)}
  $("cartToggle").onclick=()=>toggleCart(true);$("cartClose").onclick=()=>toggleCart(false);$("cartBackdrop").onclick=()=>toggleCart(false);
  $("checkoutInfo").onclick=()=>{toggleCart(false);$("shop").scrollIntoView({behavior:"smooth"})};
  search.addEventListener("input",renderProducts);
  $("categoryFilters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("active",x===b));renderProducts()});
  document.querySelectorAll("[data-category-link]").forEach(a=>a.addEventListener("click",()=>{activeCategory=a.dataset.categoryLink;document.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("active",x.dataset.category===activeCategory));setTimeout(renderProducts,0)}));
  $("menuToggle").onclick=()=>document.querySelector(".main-nav").classList.toggle("nav-open");
  $("year").textContent=new Date().getFullYear();renderCart();loadProducts();
})();
