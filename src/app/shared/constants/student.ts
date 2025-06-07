import { FormField } from "../components/generic-form/generic-form.component"

export const NEW_STUDENT_FORM_JSON: FormField[] = [
     {
      label: "Integration ID",
      name: "integrationId",
      placeholder: "Enter ID",
      type: "text",
      isRequired: true,
      validate: (value: string) => (value.length < 1 ? "Name is required" : null),
    },
    {
      label: "Name",
      name: "studentName",
      placeholder: "Enter student name",
      type: "text",
      isRequired: true,
      validate: (value: string) => (value.length < 1 ? "Name is required" : null),
    },
    {
      label: "Class",
      name: "class",
      placeholder: "Enter student class",
      type: "text",
      isRequired: true,
      validate: (value: string) => (value.length < 1 ? "Name is required" : null),
    },
    {
      label: "Section",
      name: "section",
      placeholder: "Enter student section",
      type: "text",
      isRequired: true,
      validate: (value: string) => (value.length < 1 ? "Name is required" : null),
    },
    {
      label: "Registered Date",
      name: "registeredDate",
      placeholder: "Enter registered date",
      type: "date",
      date:{ selectionMode: 'single', dateFormat: 'yy-mm-dd'},
      isRequired: true,
      validate: (value: string) => (value.length < 1 ? "Name is required" : null),
    },
     {
    label: 'Pickup Route',
    name: 'fkPickupRoute',
    placeholder: 'Select Pickup Route',
    type: 'dropdown',
    isRequired: true,
    dropdown: {
      apiEndpoint: 'LivetrackVts/Route/List',
      autoFetch: true,
        optionLabel: 'routeName' // Assuming the API returns an array of routes with a 'routeName' field
    }
  },
  {
    label: 'Pickup Stop',
    name: 'fkPickupStopId',
    placeholder: 'Select Pickup Stop',
    type: 'dropdown',
    isRequired: true,
    dropdown: {
      apiEndpoint: 'LivetrackVts/RouteStop/List',
      dependsOn: 'fkPickupRoute',
      autoFetch: false,
        optionLabel: 'stopName' // Assuming the API returns an array of stops with a 'stopName' field
    },
  },
  {
    label: 'Drop Route',
    name: 'fkDropRoute',
    placeholder: 'Select Drop Route',
    type: 'dropdown',
    isRequired: true,
    dropdown: {
      apiEndpoint: 'LivetrackVts/Route/List',
      autoFetch: true,
        optionLabel: 'routeName' // Assuming the API returns an array of routes with a 'routeName' field
    }
  },
  {
    label: 'Drop Stop',
    name: 'FkDropStopId',
    placeholder: 'Select Drop Stop',
    type: 'dropdown',
    isRequired: true,
    dropdown: {
      apiEndpoint: 'LivetrackVts/RouteStop/List',
      autoFetch: false,
        dependsOn: 'fkDropRoute',
        optionLabel: 'stopName' // Assuming the API returns an array of stops with a 'stopName' field
    }
  },
  {
    label: 'Plan',
    name: 'fkPlanId',
    placeholder: 'Select Plan',
    type: 'dropdown',
    isRequired: true,
    dropdown: {
      apiEndpoint: 'LivetrackVts/SchoolPlan/list',
      autoFetch: true,
       optionLabel: 'planName' // Assuming the API returns an array of plans with a 'planName' field
    }
  }
    
  
    
  ]