// Fake dataset embedded in JS
const ORDERS = [
  {
    id: "1001",
    status: "Shipped",
    steps: ["Ordered","Packed","Shipped","Out for delivery","Delivered"],
    progressIndex: 2,
    eta: "3–5 business days",
    lastUpdate: "Package departed facility • 2h ago",
    address: "123 Demo Street, Cyber City",
    items: 2,
    carrier: "DemoExpress"
  },
  {
    id: "1002",
    status: "Out for delivery",
    steps: ["Ordered","Packed","Shipped","Out for delivery","Delivered"],
    progressIndex: 3,
    eta: "Arriving today",
    lastUpdate: "Courier is on the way",
    address: "55 Jalan Contoh, Kuala Lumpur",
    items: 1,
    carrier: "SpeedyGo"
  },
  {
    id: "1003",
    status: "Processing",
    steps: ["Ordered","Packed","Shipped","Out for delivery","Delivered"],
    progressIndex: 0,
    eta: "Ships in 24h",
    lastUpdate: "Payment confirmed • 30m ago",
    address: "456 Example Ave, Singapore",
    items: 3,
    carrier: "—"
  }
];

const DEMO_ORDER = {
  id: "DEMO-001",
  status: "Processing",
  steps: ["Ordered","Packed","Shipped","Out for delivery","Delivered"],
  progressIndex: 1,
  eta: "Ships tomorrow",
  lastUpdate: "Order confirmed just now",
  address: "N/A",
  items: 1,
  carrier: "—"
};

function findOrder(orderId){
  return ORDERS.find(o => o.id.toLowerCase() === orderId.toLowerCase());
}

function percentFor(order){
  const total = order.steps.length - 1;
  return Math.round((order.progressIndex / total) * 100);
}

function renderResult(order){
  const el = document.getElementById('result');
  const progress = percentFor(order);

  const steps = order.steps.map((s, idx) => {
    const cls = idx < order.progressIndex ? 'step done' : (idx === order.progressIndex ? 'step current' : 'step');
    return `<span class="${cls}">${s}</span>`;
  }).join('');

  el.innerHTML = `
    <div class="result-head">
      <h2>Order <span class="badge">#${order.id}</span></h2>
      <span class="badge">${order.status}</span>
    </div>
    <div class="order-rows">
      <div class="kv"><div class="k">Status</div><div class="${order.progressIndex >= 3 ? 'ok' : ''}">${order.status}</div></div>
      <div class="kv"><div class="k">ETA</div><div>${order.eta}</div></div>
      <div class="kv"><div class="k">Last update</div><div>${order.lastUpdate}</div></div>
      <div class="kv"><div class="k">Delivery address</div><div>${order.address}</div></div>
      <div class="kv"><div class="k">Items</div><div>${order.items}</div></div>
      <div class="kv"><div class="k">Carrier</div><div>${order.carrier}</div></div>
    </div>
    <div class="progress">${steps}</div>
    <div class="timeline"><div class="bar" style="width:${progress}%"></div></div>
  `;
  el.classList.remove('hidden');
}

document.getElementById('trackForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('orderId').value.trim();
  const order = findOrder(id);
  if(order){
    renderResult(order);
  } else {
    // Not found -> show demo order with warning
    const el = document.getElementById('result');
    el.innerHTML = `
      <div class="result-head">
        <h2>Order <span class="badge">#${id || '—'}</span></h2>
        <span class="badge warn">Not found</span>
      </div>
      <p class="warn">We couldn't find that order. Showing a demo order instead.</p>
    `;
    el.classList.remove('hidden');
    setTimeout(()=>renderResult(DEMO_ORDER), 600);
  }
});

document.getElementById('demoBtn').addEventListener('click', () => {
  document.getElementById('orderId').value = DEMO_ORDER.id;
  renderResult(DEMO_ORDER);
});

// Support query params: ?order=1001
const params = new URLSearchParams(window.location.search);
const prefill = params.get('order');
if(prefill){
  document.getElementById('orderId').value = prefill;
  const o = findOrder(prefill) || DEMO_ORDER;
  renderResult(o);
}
