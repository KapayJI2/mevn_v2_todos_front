export const checkFirstName = (rule, value, callback) => {
  if (!value) {
    callback(new Error("Введите имя"));
  }
  if (value.length < 3) {
    callback(new Error("Минимум 3 символа"));
  }
  callback();
};
export const checkLastName = (rule, value, callback) => {
  if (!value) {
    callback(new Error("Введите фамилию"));
  }
  if (value.length < 3) {
    callback(new Error("Минимум 3 символа"));
  }
  callback();
};
export const checkEmail = (rule, value, callback) => {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    callback(new Error("Введите корректный адрес электронной почты"));
  }
  callback();
};
export const checkPassword = (rule, value, callback) => {
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
      value
    )
  ) {
    callback(
      new Error(
        "Должен быть 1 впецсимвол [!,@,#,$,%,^,&,*], 1 заглавная,1 строчная буквы и 8 символов в длину"
      )
    );
  }
  callback();
};
export const checkPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("Поле не должно быть пустым"));
  }
  if (!/\+\d{1,3}\-\d{1,3}\-\d{1,3}\-\d{1,3}\-\d{1,3}/.test(value)) {
    callback(new Error("введите телефон вида +Х-ХХХ-ХХХ-ХХ-ХХ"));
  }
  callback();
};
