const urlBase = "http://localhost:9000";
const modalLogin = document.getElementById("modalLogin");
const bsModalLogin = new bootstrap.Modal(modalLogin, (backdrop = "static")); // Pode passar opções
const modalRegistar = document.getElementById("modalRegistar");
const bsModalRegistar = new bootstrap.Modal(
  modalRegistar,
  (backdrop = "static")
); // Pode passar opções

const btnModalLogin = document.getElementById("btnModalLogin");
const btnModalRegistar = document.getElementById("btnModalRegistar");
const btnLogoff = document.getElementById("btnLogoff");
const pRegistar = document.getElementById("pRegistar");
const listaLivros = document.getElementById("listaLivros");

pRegistar.addEventListener("click", () => {
  bsModalLogin.hide();
  chamaModalRegistar();
});

modalLogin.addEventListener("shown.bs.modal", () => {
  document.getElementById("usernameLogin").focus();
});
btnModalLogin.addEventListener("click", () => {
  bsModalLogin.show();
});
btnModalRegistar.addEventListener("click", () => {
  chamaModalRegistar();
});

function chamaModalRegistar() {
  document.getElementById("btnSubmitRegistar").style.display = "block";
  document.getElementById("btnCancelaRegistar").innerHTML = "Cancelar";
  bsModalRegistar.show();
}

btnLogoff.addEventListener("click", () => {
  localStorage.removeItem("token");
  document.getElementById("btnLogoff").style.display = "none";
  window.location.replace("index.html");
});

function validaRegisto() {
  let email = document.getElementById("usernameRegistar").value; // email é validado pelo próprio browser
  let senha = document.getElementById("senhaRegistar").value; // tem de ter uma senha
  const statReg = document.getElementById("statusRegistar");
  if (senha.length < 4) {
    document.getElementById("passErroLogin").innerHTML =
      "A senha tem de ter ao menos 4 carateres";
    return;
  }
  fetch(`${urlBase}/api/registar`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: `email=${email}&password=${senha}`,
  })
    .then(async (response) => {
      if (!response.ok) {
        erro = response.statusText;
        statReg.innerHTML = response.statusText;
        throw new Error(erro);
      }
      result = await response.json();
      console.log(result.message);
      statReg.innerHTML = result.message;
      document.getElementById("btnSubmitRegistar").style.display = "none";
      document.getElementById("btnCancelaRegistar").innerHTML =
        "Fechar este diálogo";
    })
    .catch((error) => {
      document.getElementById(
        "statusRegistar"
      ).innerHTML = `Pedido falhado: ${error}`;
    });
}

function validaLogin() {
  let email = document.getElementById("usernameLogin").value; // email é validado pelo próprio browser
  let senha = document.getElementById("senhaLogin").value; // tem de ter uma senha
  if (senha.length < 4) {
    document.getElementById("passErroLogin").innerHTML =
      "A senha tem de ter ao menos 4 carateres";
    return;
  }
  const statLogin = document.getElementById("statusLogin");

  fetch(`${urlBase}/api/login`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `email=${email}&password=${senha}`,
  })   
    .then(async (response) => {
      if (!response.ok) {
        erro = await response.json();
        throw new Error(erro.msg);
      }
      result = await response.json();
      console.log(result.accessToken);
      const token = result.accessToken;
      localStorage.setItem("token", token);
      document.getElementById("statusLogin").innerHTML = "Sucesso!";
      // listaDisciplinas.innerHTML = "";
      document.getElementById("btnLoginClose").click();
    })
    .catch(async (error) => {
      statLogin.innerHTML = error;
    });
}

// async function getDisciplinas(id) {
//   const criteria = document.getElementById("searchkey").value;
//   console.log("Critério: " + criteria);

//   let url = urlBase + "/disciplinas";
//   const token = localStorage.token;
//   console.log(token);

//   if (id != "") {
//     url = url + "/:" + id;
//   } else if (criteria != "") {
//     url = url + "/key/:" + criteria;
//   }

//   console.log("URL: " + url);
//   const myInit = {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   const myRequest = new Request(url, myInit);

//   await fetch(myRequest).then(async function (response) {
//     if (!response.ok) {
//       listaDisciplinas.innerHTML = "Não posso mostrar disciplinas de momento!";
//     } else {
//       disciplinas = await response.json();
//       console.log(disciplinas);
//       let texto = "";
//       if (Object.keys(disciplinas).length == 1) {
//         // Só retornou uma disciplina, detalhamos
//         disciplina = disciplinas[0];
//         texto += ` 
//           <div>
//             <h4>${disciplina.disciplina}</h4>
//             &nbsp&nbsp&nbsp${disciplina.curso} -- Ano: ${disciplina.ano}<br /> 
//             &nbsp&nbsp&nbspDocente: ${disciplina.docente}
//           </div>`;
//       } else {
//         // Retornou mais de uma disciplina
//         for (const disciplina of disciplinas) {
//           texto += ` 
//             <div>
//               <h4>${disciplina.disciplina}
//               <button type="button" onclick="getDisciplinas('${disciplina._id}')">
//                 Clique aqui para detalhar esta disciplina
//               </button></h4>
//             </div>`;
//         }
//       }
//       listaDisciplinas.innerHTML = texto;
//     }
//   });
// }


async function getBooks(livrary) {

  let url = urlBase + "/libraries/" + livrary;
  const token = localStorage.token;
  console.log(token);

  console.log("URL: " + url);
  const myInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  };
  const myRequest = new Request(url, myInit);

  await fetch(myRequest).then(async function (response) {
    if (!response.ok || !localStorage.getItem('token')) {
      listaLivros.innerHTML = `Não posso mostrar livros da ${livrary} de momento!`;
    } else {
      books = await response.json();
      console.log(books);
      let texto = "<ul>";
      for (let i = 0; i < books.length; i++) {
        console.log(books[i])
        let book = books[i]        
        texto += `
        <li>
          <img src="${book.urlImage}"</img>
          <h4><a href="${book.url}" target="_blank">${book.title}</a></h4>
          <p>Preço: ${book.price}</p>
        </li>
        `
      }
      listaLivros.innerHTML = texto;
    }
  });
}

async function filler() {
  
  let libraries = [];
  let urlImages = [];

  let url = urlBase + "/libraries";

  console.log("URL: " + url);
  let myInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  let myRequest = new Request(url, myInit);

  await fetch(myRequest).then(async function (response) {
    if (!response.ok) {
      console.log('Erro no pedido');
    } else {
      libraries = await response.json();
    }
  });

  for (let i = 0; i < libraries.length; i++) {
    let library = libraries[i]

    url = urlBase + "/libraries/" + library;

    console.log("URL: " + url);
    let myInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    let myRequest = new Request(url, myInit);

    await fetch(myRequest).then(async function (response) {
      if (!response.ok) {
        console.log('Erro no pedido');
      } else {
        books = await response.json();
        books.forEach(book => {
          urlImages.push(book.urlImage)
        })
      }
    });
  }

  let imagens = "";

  for (let j = 0; j < urlImages.length; j++) {
    imagens += `
    <div class="carousel-item active">
      <img class="d-block w-100" src="${urlImages[j]}" alt="Slide ${j}">
    </div>  
    `
  }


  document.getElementById('carousel').innerHTML = `
  <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
      <div class="carousel-inner">
      ${imagens}
      </div>
      <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
  `
  
  
  console.log(urlImages)
};

filler()

