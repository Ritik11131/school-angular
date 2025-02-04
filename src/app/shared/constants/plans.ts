export const NEW_PLAN_FORM_JSON = [
    {
        label: "Name",
        name: "name",
        placeholder: "Enter your name",
        type: "text",
        isRequired: true,
        validate: (value: string) => (value.length < 1 ? "Name is required" : null),
    },
    {
        label: "Price",
        name: "price",
        placeholder: "Enter Price",
        type: "number",
        isRequired: true,
        validate: (value: string) => (value.length < 1 ? "Price is required" : null),
    },
    {
        label: "Currency",
        name: "currency",
        placeholder: "",
        type: "radio",
        isRequired: true,
        options: [
            {
                label: "INR",
                name: "INR",
            },
            {
                label: "USD",
                name: "USD",
            }
        ],
    },
    {
        label: "Days",
        name: "days",
        placeholder: "Select Days",
        type: "slider",
        isRequired: true,
    },
    {
        label: "Description",
        name: "description",
        placeholder: "Your Description",
        type: "textarea",
    },
]