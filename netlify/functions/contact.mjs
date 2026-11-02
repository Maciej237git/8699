const reply=(statusCode,message)=>({statusCode,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'},body:JSON.stringify({message})});
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function handler(event){
 if(event.httpMethod!=='POST')return reply(405,'Niedozwolona metoda.');
 if((event.body||'').length>12000)return reply(413,'Wiadomość jest zbyt długa.');
 let data;try{data=JSON.parse(event.body||'{}')}catch{return reply(400,'Nieprawidłowe dane.');}
 if(data.website)return reply(400,'Nie udało się wysłać wiadomości.');
 const name=String(data.name||'').trim(),phone=String(data.phone||'').trim(),message=String(data.message||'').trim();
 if(name.length<2||name.length>100||!/^\+?[0-9 ()-]{7,20}$/.test(phone)||message.length>3000)return reply(400,'Sprawdź imię, telefon i długość wiadomości.');
 if(!['Kościerzyna','Bytów'].includes(data.office))return reply(400,'Wybierz biuro.');
 if(!process.env.BREVO_API_KEY||!process.env.BREVO_SENDER_EMAIL)return reply(503,'Wysyłka formularza nie została jeszcze uruchomiona.');
 const recipient=data.office==='Bytów'?(process.env.CONTACT_BYTOW||'bytow@8699.pl'):(process.env.CONTACT_KOSCIERZYNA||'koscierzyna@8699.pl');
 const topic=String(data.insurance||'Zapytanie').slice(0,100);
 try{
 const res=await fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',headers:{'api-key':process.env.BREVO_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({sender:{name:'8699.pl — formularz',email:process.env.BREVO_SENDER_EMAIL},to:[{email:recipient}],subject:'Zapytanie ze strony — '+data.office,htmlContent:'<h2>Zapytanie ze strony 8699.pl</h2><p><b>Imię:</b> '+escape(name)+'</p><p><b>Telefon:</b> '+escape(phone)+'</p><p><b>Temat:</b> '+escape(topic)+'</p><p><b>Wiadomość:</b><br>'+escape(message).replace(/\n/g,'<br>')+'</p>'})});
 if(!res.ok)return reply(502,'Usługa pocztowa nie przyjęła wiadomości.');
 return reply(200,'Wiadomość została wysłana.');
 }catch{return reply(502,'Nie udało się połączyć z pocztą.');}
}
