const payload = {
  token_rdstation: "037fc3f878d43c7b81f9c30c3354215d",
  identificador: "test-api",
  email: "test@bi2b.com.br",
  nome: "Test"
};

fetch('https://www.rdstation.com.br/api/1.2/conversions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(async res => {
  console.log("Status:", res.status);
  console.log("Text:", await res.text());
})
.catch(console.error);
