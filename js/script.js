// inicialização do jQuery
$(() => {
  // credenciais da API
  $.cloudinary.config({
    api_key: "178281113397519",
    cloud_name: "lucianahb",
    secure: true,
  });

  // seleção do formulário e seus inputs
  const formMain = $("#form-main");
  const inputName = $("#name");
  const inputEmail = $("#email");
  const inputPhone = $("#phone");

  // event listener do evento submit do formulário
  formMain.on("submit", (event) => {
    // prevenção do comportamento padrão do evento submit
    event.preventDefault();

    // valores dos inputs
    const name = inputName.val();
    const email = inputEmail.val();
    const phone = inputPhone.val();
    // valores do cloudinary
    const overlayFontFamily = "Arial";
    const overlayFontSize = 20;
    const overlayColor = "#000";
    const overlayGravity = "north";
    const overlayYAxis = 135;

    // validação do form
    if (validateForm()) {
      // transformação da imagem através da API do cloudinary
      let img = $.cloudinary.image("PRINT_PRIME_ARTE_ubimzp.png", {
        transformation: [
          { width: 600, crop: "scale" },
          {
            overlay: new cloudinary.TextLayer()
              .fontFamily(overlayFontFamily)
              .fontSize(overlayFontSize)
              .text(name),
            color: overlayColor,
            gravity: overlayGravity,
            y: overlayYAxis,
          },
          {
            overlay: new cloudinary.TextLayer()
              .fontFamily(overlayFontFamily)
              .fontSize(overlayFontSize)
              .text(email),
            color: overlayColor,
            gravity: overlayGravity,
            y: overlayYAxis + 45,
          },
          {
            overlay: new cloudinary.TextLayer()
              .fontFamily(overlayFontFamily)
              .fontSize(overlayFontSize)
              .text(phone),
            color: overlayColor,
            gravity: overlayGravity,
            y: overlayYAxis + 92,
          },
        ],
      });

      // validação da img gerada pelo cloudinary
      if (img.attr("src")) {
        // variáveis para url da img, container da img e img respectivamente
        const source = img.attr("src");
        const imageContainer = $("#image-container");
        const image = $("#image-container img");
        // atribuindo url da img ao container (link) e elemento img
        imageContainer.attr("href", source);
        image.attr("src", source);
      }
    }
  });

  // event listener do input name
  inputName.on("input", (event) => {
    // selecionando input e seu value
    const self = $(event.target);
    const value = self.val();

    // limitando o número de caracteres do input no range de 35
    if (value.length > 35) {
      self.val(value.substring(0, value.length - 1));
    }
  });

  // event listener do input phone
  inputPhone.on("input", (event) => {
    // selecionando input e seu value
    const self = $(event.target);
    const value = self.val();

    // aplicando máscara
    self.val(maskPhone(value));
  });
});

// validação do formulário
const validateForm = () => {
  // selecionando todos inputs menos o botão
  const formInputs = $("form :input:not(button)");
  let isFormValid = true;

  // para cada input, realizar a função de validação
  formInputs.each((index, input) => {
    const isInputValid = validateInput($(input));

    // se algum input não for válido, o formulário não é válido
    if (!isInputValid) {
      isFormValid = isInputValid;
    }
  });

  return isFormValid;
};

// validação de algum input
const validateInput = (input) => {
  const inputValue = input.val();
  const inputType = input.attr("type");
  let isValid = true;

  // se input vazio, mostrar mensagem de erro e retornar false
  if (inputValue === "") {
    input.next(".text-help").addClass("show danger").show();
    isValid = false;
    return isValid;
  }

  // se input for email, validar.
  // Se não for válido, mostrar mensagem de erro e retornar false
  if (inputType === "email") {
    isValid = validateEmail(inputValue);

    if (!isValid) {
      input
        .next(".text-help")
        .text("Preencha um e-mail válido.")
        .addClass("show danger")
        .show();
      return isValid;
    }
  }

  // se o input for válido, esconder mensagem de erro e retornar true
  input
    .next(".text-help")
    .text("Preencha este campo")
    .removeClass("show danger")
    .hide();

  return isValid;
};

const maskPhone = (value) => {
  let valueUnmasked = value.replace(/\D/g, "");
  valueUnmasked.replace(/^0/, "");

  if (valueUnmasked.length > 10) {
    // 11+ digits. Format as 5+4.
    valueUnmasked = valueUnmasked.replace(
      /^(\d{2})(\d{5})(\d{4}).*/,
      "($1) $2-$3"
    );
  } else if (valueUnmasked.length > 6) {
    // 6..10 digits. Format as 4+4
    valueUnmasked = valueUnmasked.replace(
      /^(\d{2})(\d{4})(\d{0,4}).*/,
      "($1) $2-$3"
    );
  } else if (valueUnmasked.length > 2) {
    // 3..5 digits. Add (00) 0000
    valueUnmasked = valueUnmasked.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else if (valueUnmasked.length > 0) {
    // 0..2 digits. Just add (0
    valueUnmasked = valueUnmasked.replace(/^(\d*)/, "($1");
  }
  return valueUnmasked;
};

const validateEmail = (email) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex.test(String(email).toLowerCase());
};
