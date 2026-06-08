export const validateEmail = (value: string) => {
  if (!value) return "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? ""
    : "올바른 이메일 형식을 입력해주세요.";
};

export const validatePhone = (value: string) => {
  if (!value) return "";
  return /^01[0-9]{8,9}$/.test(value)
    ? ""
    : "올바른 휴대폰 번호를 입력해주세요. (예: 01012345678)";
};
