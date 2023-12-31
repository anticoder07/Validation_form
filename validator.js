function validator(options) {
  let formRules = {};

  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  function validate(element) {
    let fieldName = element.getAttribute("name");
    if (formRules[fieldName]) {
      formRules[fieldName].forEach((rule) => {
        let validatorFunction = validatorRules[rule.feature];
        if (validatorFunction) {
          let errorMessage = validatorFunction(element.value);
          let formMessage = getParent(
            element,
            options.formGroupSelector
          ).querySelector(".form-message");
          if (errorMessage) {
            formMessage.innerText = errorMessage;
            getParent(element, options.formGroupSelector).classList.add(
              "invalid"
            );
          } else {
            formMessage.innerText = "";
            getParent(element, options.formGroupSelector).classList.remove(
              "invalid"
            );
          }
        }
      });
    }
  }

  let validatorRules = {
    isRequired: function (value) {
      return value ? undefined : "Vui lòng nhập trường này";
    },
    isGmail: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : "Trường này phải là email";
    },
    min: function (value, min) {
      let message = "Mật khẩu không phù hợp";
      if (value.length >= min) {
        message = "Mật khẩu phải có độ dài tối thiểu" + min + "kí tự ";
      }
      return value ? undefined : message;
    },
    max: function (value, max) {
      let message = "Mật khẩu không phù hợp";
      if (value.length <= max) {
        message = "Mật khẩu phải có độ dài tối thiểu" + max + "kí tự ";
      }
      return value ? undefined : message;
    },
    isConfirmed: function (password, value) {
      if (password === value) return undefined;
      return "Mật khẩu nhập lại không đúng";
    },
  };

  let formElements = document.querySelectorAll(options.form);
  Array.from(formElements).forEach((formElement) => {
    if (formElement) {
      let ruleElements = formElement.querySelectorAll("[name], [rule]");
      ruleElements.forEach((ruleElement) => {
        let rules = ruleElement.getAttribute("rule").split("|");
        rules.forEach((rule) => {
          let node = {};
          let nodeElement = rule.split(":");
          node["feature"] = nodeElement[0];
          node["value"] = nodeElement[1];
          if (Array.isArray(formRules[ruleElement.getAttribute("name")])) {
            formRules[ruleElement.getAttribute("name")].push(node);
          } else {
            formRules[ruleElement.getAttribute("name")] = [node];
          }
        });
      });

      let inputElements = formElement.querySelectorAll(".form-control");
      inputElements.forEach((inputElement) => {
        if (inputElement) {
          inputElement.onblur = function () {
            validate(inputElement);
          };
        }

        inputElement.oninput = function () {
          let formMessage = getParent(
            inputElement,
            options.formGroupSelector
          ).querySelector(".form-message");
          formMessage.innerText = "";
          getParent(inputElement, options.formGroupSelector).classList.remove(
            "invalid"
          );
        };
      });
    }
  });
}
