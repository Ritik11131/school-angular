export const NEW_CREW_FORM_JSON = [
    {
      label: "Name",
      name: "name",
      placeholder: "Enter your name",
      type: "text",
      isRequired: true,
      validate: (value: string) => (value.length < 1 ? "Name is required" : null),
    },
    {
      label: "Username",
      name: "username",
      placeholder: "Enter your username",
      type: "text",
      isRequired: true,
      validate: (value: string) => {
        if (value.length < 3) {
          return "Username must be at least 3 characters long"
        }
        return null
      },
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
    {
      label: "Emergency Contact No",
      name: "emergencyContact",
      placeholder: "Enter your no",
      type: "text",
      isRequired: true,
      validate: (value: string) => {
        return !/^\d{10}$/.test(value) ? "Contact number must be 10 digits" : null
      },
    },
    {
      label: "License No",
      name: "licenseNumber",
      placeholder: "Enter your license no",
      type: "text",
      isRequired: true,
      validate: (value: string) => (value.length < 1 ? "License No is required" : null),
    },
    {
      label: "Address",
      name: "address",
      placeholder: "Enter your address",
      type: "textarea",
      isRequired: true,
      validate: (value: string) => (value.length < 1 ? "Address is required" : null),
    },
    {
      label: "Role",
      name: "role",
      placeholder: "",
      type: "radio",
      options: [
        {
          label: "Pilot",
          name: "pilot",
        },
        {
          label: "Helper",
          name: "helper",
        },
        {
          label: "Teacher",
          name: "teacher",
        },
      ],
    },
  ]