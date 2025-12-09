let qr;

// INITIAL ADDRESS
const walletText = document.getElementById("walletText");

// UPDATE ON WALLET CHANGE
document.getElementById("walletSelect").addEventListener("change",()=>{
    walletText.textContent = 
        document.getElementById("walletSelect").value.includes("•") 
        ? document.getElementById("walletSelect").value.split("•")[1].trim()
        : "bc1qar0exampleaddress"
});

// GENERATE QR
document.getElementById("generateQRBtn").addEventListener("click", ()=>{
    const asset  = document.getElementById("asset").value.split(" ")[0];
    const amount = document.getElementById("amount").value;
    const memo   = document.getElementById("memo").value;
    const wallet = walletText.textContent;

    let qrData = `${asset}:${wallet}`;
    if(amount) qrData += `?amount=${amount}`;
    if(memo)   qrData += `&memo=${encodeURIComponent(memo)}`;

    const qrBox = document.getElementById("qrBox");
    qrBox.innerHTML = "";

    qr = new QRCode(qrBox,{
        text:qrData,
        width:210,
        height:210
    });
});

// COPY ADDRESS
document.getElementById("copyBtn").addEventListener("click",()=>{
    navigator.clipboard.writeText(walletText.textContent);
    alert("Wallet address copied!");
});

// DOWNLOAD REQUEST BILL
document.getElementById("downloadInvoice").addEventListener("click",()=>{
    const wallet = walletText.textContent;
    const asset  = document.getElementById("asset").value;
    const amount = document.getElementById("amount").value || "Not specified";
    const memo   = document.getElementById("memo").value || "-";

    const text =
`CRYPTO PAYMENT REQUEST
-----------------------------------
Asset  : ${asset}
Amount : ${amount}
Memo   : ${memo}

Send To:
${wallet}

Note: Ensure you send using the correct blockchain network.`;

    const blob = new Blob([text], {type:"text/plain"});
    const url  = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "crypto-payment-request.txt";
    a.click();
    URL.revokeObjectURL(url);
});

// FRIEND REQUEST BUTTONS
document.querySelectorAll(".friend-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
        const row = btn.closest(".friend-row");
        document.getElementById("memo").value = row.dataset.memo;
        document.getElementById("amount").value = row.dataset.amount;
        alert(`Request details prepared for ${row.dataset.name}`);
    });
});