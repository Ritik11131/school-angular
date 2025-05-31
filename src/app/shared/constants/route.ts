import { FormField } from "../components/generic-form/generic-form.component";

export const NEW_ROUTE_FORM_JSON: FormField[] = [
  {
    label: "Route Name",
    name: "routeName",
    placeholder: "Enter route name",
    type: "text",
    isRequired: true,
    validate: (value: string) => (value.length < 1 ? "Route name is required" : null),
  },
  {
    label: "Route Direction",
    name: "routeDirection",
    placeholder: "Provide route direction",
    type: "text",
    isRequired: true,
    validate: (value: string) => (value.length < 1 ? "Route name is required" : null),
  }
]