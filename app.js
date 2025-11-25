/* ---------------- CONFIGURACIÓN EMAILJS ---------------- */
const CORREO_DESTINO = "ivan.aros2020@gmail.com";
const WHATSAPP_DESTINO = "+56994666189";

const EMAILJS_USER_ID = "DEcA8--f5hYkmsIHI";
const EMAILJS_SERVICE_ID = "service_1b4gnxw";
const EMAILJS_TEMPLATE_ID = "template_8vbe996";

/* ---------------- RESPUESTAS CORRECTAS ---------------- */
const respuestasMC = {1:"C",2:"D",3:"C",4:"A",5:"D"};
const respuestasVF = {1:"V",2:"F",3:"V",4:"V",5:"F"};
const respuestasIII = {1:1,2:4,3:5,4:2,5:3,6:7,7:6};
const respuestasIV = {1:7,2:8,3:3,4:1,5:2,6:4,7:5,8:6};

/* Tabla de conversión de puntajes */
const tablaPuntaje = {
    0: 1, 1: 4.8, 2: 8.5, 3: 12.3, 4: 16, 5: 19.8, 6: 23.6, 7: 27.3, 8: 31.1, 9: 34.9,
    10: 38.6, 11: 42.4, 12: 46.1, 13: 49.9, 14: 53.7, 15: 57.4, 16: 61.2, 17: 65, 18: 68.7,
    19: 72.5, 20: 76.2, 21: 80, 22: 81.4, 23: 82.9, 24: 84.3, 25: 85.7, 26: 87.1, 27:88.6,
    28: 90, 29: 91.4, 30: 92.9, 31: 94.3, 32: 95.7, 33: 97.1, 34: 98.6, 35: 100
};

/* ---------------- CREACIÓN DE SECCIONES ---------------- */
function crearSecciones() {

    /* Sección 1 */
    document.getElementById("seccion1").innerHTML =
        Array.from({length:5}, (_,i) => `
            <div class="preg">${i+1})
                A <input type="radio" name="s1_${i+1}" value="A">
                B <input type="radio" name="s1_${i+1}" value="B">
                C <input type="radio" name="s1_${i+1}" value="C">
                D <input type="radio" name="s1_${i+1}" value="D">
            </div>
        `).join("");

    /* Sección 2 */
    document.getElementById("seccion2").innerHTML =
        Array.from({length:5},(_,i)=>`
            <div class="preg">${i+1})
                V <input type="radio" name="s2_${i+1}" value="V">
                F <input type="radio" name="s2_${i+1}" value="F">
            </div>`).join("");

    /* Sección 3 */
    document.getElementById("seccion3").innerHTML =
        Array.from({length:7},(_,i)=>`
            <div class="preg">${i+1})
                ${[1,2,3,4,5,6,7].map(n =>
                `${n} <input type="radio" name="s3_${i+1}" value="${n}">`).join(" ")}
            </div>`).join("");

    /* Sección 4 */
    const nombresS4 = [
        "Rueda Guía", "Cadena de Oruga", "Rodillos Superiores",
        "Corona dentada (Sprocket)", "Mando Final", "Rueda Tensora",
        "Bastidor", "Rodillos Guía Inferiores"
    ];

    document.getElementById("seccion4").innerHTML =
        nombresS4.map((txt,i)=>`
            <div class="preg">${txt}:
                ${[1,2,3,4,5,6,7,8].map(n =>
                `${n} <input type="radio" name="s4_${i+1}" value="${n}">`).join(" ")}
            </div>`).join("");
}

/* ---------------- EVALUAR ---------------- */
function evaluar() {
    let p = 0;

    for(let i=1;i<=5;i++){
        const r=document.querySelector(`input[name=s1_${i}]:checked`);
        if(r && r.value===respuestasMC[i]) p+=2;
    }

    for(let i=1;i<=5;i++){
        const r=document.querySelector(`input[name=s2_${i}]:checked`);
        if(r && r.value===respuestasVF[i]) p+=2;
    }

    for(let i=1;i<=7;i++){
        const r=document.querySelector(`input[name=s3_${i}]:checked`);
        if(r && r.value===String(respuestasIII[i])) p+=1;
    }

    for(let i=1;i<=8;i++){
        const r=document.querySelector(`input[name=s4_${i}]:checked`);
        if(r && r.value===String(respuestasIV[i])) p+=1;
    }

    return p;
}

function calcularPorcentaje(p){
    if(tablaPuntaje[p]) return tablaPuntaje[p];
    return 0;
}

/* Bloqueo */
function bloquearFormulario() {
    document.querySelectorAll("input").forEach(i => i.disabled = true);
    document.getElementById("enviarBtn").disabled = true;
}

/* ---------------- INFORME ---------------- */
function generarInforme() {
    const t = document.getElementById("trabajador").value;
    const inst = document.getElementById("instructor").value;
    const fecha = document.getElementById("fecha").value;

    const puntaje = evaluar();
    const porcentaje = calcularPorcentaje(puntaje).toFixed(1);
    const estado = porcentaje >= 80 ? "APROBADO" : "REPROBADO";

    const texto = `📋 Informe de Evaluación Bulldozer

👷 Trabajador: ${t}
📘 Instructor: ${inst}
📅 Fecha: ${fecha}

⭐ Resultado: ${estado}
Puntaje: ${puntaje}/35
Porcentaje: ${porcentaje}%`;

    return {
        texto: texto,
        asunto: `[Informe Evaluación Bulldozer] - ${t} - ${fecha} - ${estado} - ${porcentaje}%`,
        datos: {trabajador:t,instructor:inst,fecha,puntaje,porcentaje,estado,mensaje_completo:texto}
    };
}

/* ---------------- ENVÍO EMAILJS ---------------- */
async function enviarEmailAutomatico(informe) {
    try {
        if (typeof emailjs === "undefined") {
            await new Promise((resolve,reject)=>{
                const s=document.createElement("script");
                s.src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
                s.onload=resolve;
                s.onerror=reject;
                document.head.appendChild(s);
            });
        }

        emailjs.init(EMAILJS_USER_ID);

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            to_email: CORREO_DESTINO,
            subject: informe.asunto,
            trabajador: informe.datos.trabajador,
            instructor: informe.datos.instructor,
            fecha: informe.datos.fecha,
            puntaje: informe.datos.puntaje,
            porcentaje: informe.datos.porcentaje,
            estado: informe.datos.estado,
            mensaje_completo: informe.datos.mensaje_completo
        });

        return true;
    } catch (e) {
        console.error("EmailJS error:",e);
        return false;
    }
}

/* ---------------- WHATSAPP ---------------- */
function enviarWhatsApp(informe) {
    const txt = encodeURIComponent(informe.texto);
    const num = WHATSAPP_DESTINO.replace(/\D/g,"");
    window.open(`https://wa.me/${num}?text=${txt}`);
}

/* ---------------- EVENTOS ---------------- */
document.addEventListener("DOMContentLoaded",()=>{

    crearSecciones();

    document.getElementById("enviarBtn").addEventListener("click",async()=>{
        
        const informe = generarInforme();

        document.getElementById("resultado").style.display="block";
        document.getElementById("resultado").innerHTML = informe.texto.replace(/\n/g,"<br>");

        const emailOK = await enviarEmailAutomatico(informe);
        enviarWhatsApp(informe);

        bloquearFormulario();

        if(emailOK){
            alert("📨 Informe enviado por EmailJS y WhatsApp correctamente.");
        } else {
            alert("⚠ WhatsApp enviado. Hubo un problema con EmailJS.");
        }
    });

    document.getElementById("calcularBtn").addEventListener("click",()=>{
        const p = evaluar();
        const porc = calcularPorcentaje(p).toFixed(1);
        document.getElementById("resultado").style.display="block";
        document.getElementById("resultado").innerHTML =
            `Puntaje: <b>${p}/35</b><br>Porcentaje: <b>${porc}%</b>`;
    });

});
