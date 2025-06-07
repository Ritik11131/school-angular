export const NEW_PLAN_FORM_JSON = [
    {
        label: "Name",
        name: "planName",
        placeholder: "Enter your name",
        type: "text",
        isRequired: true,
        validate: (value: string) => (value.length < 1 ? "Name is required" : null),
    },
    {
        label: "Price",
        name: "planRate",
        placeholder: "Enter rate",
        type: "number",
        isRequired: true,
        validate: (value: string) => (value.length < 1 ? "Price is required" : null),
    },
     {
        label: "Gateway Fees",
        name: "gatewayFees",
        placeholder: "Enter Fees",
        type: "number",
        isRequired: true,
        validate: (value: string) => (value.length < 1 ? "Price is required" : null),
    },
   {
        label: "GST Rate",
        name: "gstRate",
        placeholder: "Enter GST Rate",
        type: "number",
        isRequired: true,
        validate: (value: string) => (value.length < 1 ? "Price is required" : null),
    },
]