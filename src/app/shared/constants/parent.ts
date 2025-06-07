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
      label: "Contact No",
      name: "registeredMobileNo",
      placeholder: "Enter your contact Number",
      type: "text",
      isRequired: true,
      validate: (value: string) => {
        return !/^\d{10}$/.test(value) ? "Contact number must be 10 digits" : null
      },
    },
  
    
  ]