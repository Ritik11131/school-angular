export const NEW_PARENT_FORM_JSON = [
    {
      label: "Name",
      name: "name",
      placeholder: "Enter your name",
      type: "text",
      isRequired: true,
      validate: (value: string) => (value.length < 1 ? "Name is required" : null),
    },
   
    {
      label: "Email",
      name: "email",
      placeholder: "Enter your email",
      type: "email",
      isRequired: true,
      validate: (value: string) => {
        const emailPattern = /\S+@\S+\.\S+/
        return !emailPattern.test(value) ? "Please enter a valid email" : null
      },
    },
    {
      label: "Contact No",
      name: "contactNumber",
      placeholder: "Enter your contact Number",
      type: "text",
      isRequired: true,
      validate: (value: string) => {
        return !/^\d{10}$/.test(value) ? "Contact number must be 10 digits" : null
      },
    },
  
    
  ]