// elements
const El = {
    fromWallet: document.getElementById("fromWallet"),
    asset: document.getElementById("asset"),
    network: document.getElementById("network"),
    address: document.getElementById("address"),
    memo: document.getElementById("memo"),
    amount: document.getElementById("amount"),
    priority: document.getElementById("priority"),
    purpose: document.getElementById("purpose"),
    twofa: document.getElementById("twofa"),
    confirm: document.getElementById("confirm")
};

// summary elements
const Sum = {
    asset: document.getElementById("sumAsset"),
    network: document.getElementById("sumNetwork"),
    from: document.getElementById("sumFrom"),
    to: document.getElementById("sumTo"),
    amount: document.getElementById("sumAmount"),
    fee: document.getElementById("sumFee"),
    total: document.getElementById("sumTotal")
};

function updateSummary(){
    let amt = parseFloat(El.amount.value)||0;
    let fee = amt>0 ? 0.00035 * Number(El.priority.value) : 0;

    Sum.asset.textContent = El.asset.value;
    Sum.network.textContent = El.network.value;
    Sum.from.textContent = El.fromWallet.value;
    Sum.to.textContent = El.address.value ? El.address.value.slice(0,6)+"..."+El.address.value.slice(-4) : "—";
    Sum.amount.textContent = amt.toFixed(4);
    Sum.fee.textContent = fee.toFixed(6);
    Sum.total.textContent = (amt+fee).toFixed(6);
}

["input","change"].forEach(evt=>{
    document.querySelectorAll("select, input").forEach(i=> i.addEventListener(evt, updateSummary));
});

updateSummary();

// submit
document.getElementById("sendForm").addEventListener("submit",e=>{
    e.preventDefault();

    if(El.address.value.length < 10) return alert("Invalid wallet address.");
    if(!El.amount.value || El.amount.value <= 0) return alert("Enter an amount.");
    if(!/^[0-9]{6}$/.test(El.twofa.value)) return alert("Enter a valid 6-digit 2FA code.");
    if(!El.confirm.checked) return alert("Please confirm the address verification.");

    document.getElementById("successModal").style.display="flex";

    setTimeout(()=>{
        window.location.href="../transactions/transaction.html";
    }, 2500);
});

// close modal
function closeModal(){
    document.getElementById("successModal").style.display="none";
}

// download bill
document.getElementById("billBtn").addEventListener("click",()=>{
    if(!El.address.value || El.amount.value<=0) return alert("Enter details before generating bill.");

    let text =
`DRAFT CRYPTO BILL
--------------------------------
Asset   : ${El.asset.value}
Amount  : ${El.amount.value}
To      : ${El.address.value}
Network : ${El.network.value}
Memo    : ${El.memo.value||"-"}
Purpose : ${El.purpose.value||"-"}
--------------------------------
NOTE: This is not a blockchain record.`;

    const BlobData = new Blob([text],{type:"text/plain"});
    const url = URL.createObjectURL(BlobData);
    const a=document.createElement("a");
    a.href=url;
    a.download="crypto-draft.txt";
    a.click();
});

// fill from friend
document.querySelectorAll(".friend-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
        const row=btn.closest(".friend-row");
        El.address.value=row.dataset.addr;
        El.purpose.value=`Payment to ${row.dataset.name}`;
        updateSummary();
        window.scrollTo({top:0,behavior:"smooth"});
    });
});