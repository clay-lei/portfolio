
// "use client"
// import { useState, ChangeEvent, useEffect, useRef, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import FormInput from './FormInput';
// import Calendar from './Calender';
// import Dropdown from './Dropdown';
// import RangeInput from './RangeInput';
// import DragList from './DragList';
// import Map from './Map';
// import MultiSelect from './MultiSelect';
// import PhotoUpload from './PhotoUpload';
// import PasswordInput from './PasswordInput';
// import MultiNeighborhoodInput from './MultiNeighborhoodInput';
// import { buyerFormFields, sellerFormFields, agentFormFields } from "@/app/questionnaire/formFields";

// type RangeListItem = {
//   label: string;
//   id: string;
//   name: string;
//   rangeLabels: string[];
// };

// export type pageFormData<T = unknown> = {
//   label: string;       // Label for the field
//   id: string;          // Unique identifier for the field
//   name: string;        // Name of the field (for state key)
//   type?: string;       // Field type ("text", "calendar", "dropdown", etc.)
//   options?: { label: string, value: string | number }[];  // Optional options if field is a dropdown
//   rangeLabels?: T[]; // Optional labels for range type fields 
//   rangeList?: RangeListItem[]; // For ListRangeInput
//   isOptional?: boolean; // Whether the field is optional
//   description?: string; // Description text for the field
//   placeholder?: string; // Example placeholder text
//   maxLength?: number;   // Maximum length for text inputs
//   pattern?: string;     // Regex pattern for validation
//   multiple?: boolean;   // Whether dropdown allows multiple selection
//   mode?: string; // Whether multiSelect allows single or multiple selection
//   rangeMode?: string; // Whether range input allows single or range selection
//   defaultValue?: number | [number, number]; // Default value for range inputs
//   section?: string; // New field for grouping
//   min?: number; // Minimum value for range inputs
//   max?: number; // Maximum value for range inputs
//   showLocationButton?: boolean; // For map type fields
//   addressSuggestions?: boolean; // For map type fields
//   citySuggestions?: boolean; // For map type fields
//   step?: number; // Step value for range inputs
//   showIf?: { field: string; value: unknown }; // Conditional display logic
//   hidden?: boolean; // Whether the field is hidden
// };

// type apiCallBodyFields = string[];

// type apiCall = {
//   url: string;
//   method: string;
//   body: apiCallBodyFields;
// };

// type ChatbotFormProps = {
//   data: Record<string, unknown>;
//   setData: (data: Record<string, unknown>) => void;
//   confirmationDisplayFunction?: (data: Record<string, unknown>) => Record<string, unknown>;
//   apiInterfaceFunction?: (data: Record<string, unknown>) => Record<string, unknown>;
//   fields: pageFormData<{ [key: string]: string | number | boolean | object | string[] | number[] | boolean[] | object[] }>[];
//   apiCalls: apiCall[];
//   redirectUrl: string;
//   showConfirmation?: boolean;
//   defaultData?: Record<string, unknown>;
//   termsDisclaimer?: string;
// }

// type ChatMessage = {
//   text: string;
//   sender: 'user' | 'bot';
//   fieldName?: string
// };

// function isFieldVisible(field: pageFormData, data: Record<string, unknown>) {
//   if (field.hidden) return false;
//   if (!field.showIf) return true;
//   return data[field.showIf.field] === field.showIf.value;
// }

// export default function Chatbot(props: ChatbotFormProps) {
//   const { refreshSession } = useAuth();
//   const router = useRouter();
//   const [currentData, setCurrentData] = useState<Record<string, unknown>>(props.defaultData || {});
//   const [currentStep, setCurrentStep] = useState(0);
//   const [error, setError] = useState<string | null>(null);
//   const [formConfirmationReached, setFormConfirmationReached] = useState(false);
//   const [passwordValid, setPasswordValid] = useState<Record<string, boolean>>({});
//   const [isTermsChecked, setIsTermsChecked] = useState(false);
//   const [isTermsOpen, setIsTermsOpen] = useState(false);
//   const [messages, setMessages] = useState<ChatMessage[]>([]); // bubble message
//   const [editingField, setEditingField] = useState<string | null>(null); // editing state
//   const [editingValue, setEditingValue] = useState<string>(""); // editing state
//   const [activeFields, setActiveFields] = useState(props.fields); // user identity

//   const chatContainerRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const userIdentity = useMemo(() => currentData['userIdentity'], [currentData]);

//   // focus input when editing
//   const visibleFields = useMemo(() => {
//     return activeFields.filter((f) => isFieldVisible(f, currentData));
//   }, [activeFields, currentData]);

//   const currentField = visibleFields[currentStep];

//   // Scroll to bottom on new message
//   useEffect(() => {
//     requestAnimationFrame(() => {
//       // scroll all the way down
//       const chat = chatContainerRef.current;
//       if (chat) chat.scrollTop = chat.scrollHeight;
//     });
//   }, [messages, error]);

//   useEffect(() => {
//     if (currentStep > visibleFields.length - 1) {
//       setCurrentStep(Math.max(visibleFields.length - 1, 0));
//     }
//   }, [visibleFields.length, currentStep]);
//   // useridentity change effect
//   useEffect(() => {
//     let fields = props.fields;
//     if (userIdentity === 'Buyer') {
//       fields = buyerFormFields;
//     } else if (userIdentity === 'Seller') {
//       fields = sellerFormFields;
//     } else if (userIdentity === 'Agent') {
//       fields = agentFormFields;
//     }

//     setActiveFields(fields);

//     if (fields.length > 0) {
//       setMessages([
//         {
//           sender: "bot",
//           text: "Welcome! We're so glad we're able to connect with you today. Let's begin.",
//         },
//         {
//           sender: "bot",
//           text: buildBotPrompt(fields[0]),
//         },
//       ]);
//     }
//   }, [userIdentity, props.fields]);



//   // question text for bot
//   function buildBotPrompt(field: pageFormData) {
//     if (field.description) {
//       return `${field.description}`;
//     }
//     return `Please provide your ${field.label.toLowerCase()}.`;
//   }

//   // begin editing a previous answer
//   function beginEdit(fieldName: string) {
//     const raw = currentData[fieldName];
//     // tracking which field and value are being edited
//     setEditingField(fieldName);
//     setEditingValue(String(raw));
//   }

//   // save editing a previous answer, formFields refers to currentField.name
//   function saveEdit() {
//     if (!editingField) return;

//     const field = activeFields.find(f => f.name === editingField);
//     const newData = { ...currentData, [editingField]: editingValue };
//     setCurrentData(newData);
//     setMessages(prev =>
//       prev.map(messages =>
//         messages.sender === "user" && messages.fieldName === editingField // find the one being edited
//           ? { ...messages, text: formatBubbleAnswer(field!, editingValue) } //copy message and update text
//           : messages
//       )
//     );
//     setEditingField(null);
//     setEditingValue("");
//     setError(null);
//   }

//   const handleFieldUpdate = (
//     name: string,
//     value: string | number | boolean | object | string[] | number[] | boolean[] | object[]
//   ) => {
//     setCurrentData((prev) => {
//       const next = { ...prev, [name]: value };

//       if (name === "lenderCooperation") {
//         if (value === "yes") {
//           delete next.financingType;
//           delete next.lendingPartnerConnection;
//         } else if (value === "no") {
//           delete next.hasLoanPreapproval;
//         }
//       }

//       return next;
//     });
//   };

//   // Handle password validation
//   const handlePasswordValidation = (fieldName: string, isValid: boolean) => {
//     setPasswordValid(prev => ({ ...prev, [fieldName]: isValid }));
//   };

//   // Specific change handler for text inputs
//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     handleFieldUpdate(name, value);
//   };

//   // Hit enter to go to next question
//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       goToNextQuestion();
//     }
//   };

//   // Validation for current field
//   function validateCurrentField(): boolean {
//     if (!currentField) return true;
//     const fieldValue = currentData[currentField.name];

//     // Validate required fields
//     if (!currentField.isOptional) {

//       // Special validation for map fields
//       if (currentField.type === "map") {
//         if (!fieldValue || !Array.isArray(fieldValue) || fieldValue.length !== 3) {
//           setError(`Please select a location for ${currentField.label}`);
//           return false;
//         }
//       } else if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
//         setError(`Please provide an answer for ${currentField.label}`);
//         return false;
//       }
//     }

//     // Validate regex pattern if field has a pattern and a value
//     if (currentField.pattern && currentData[currentField.name]) {
//       const fieldValue = String(currentData[currentField.name]);
//       try {
//         const regex = new RegExp(currentField.pattern);
//         if (!regex.test(fieldValue)) {
//           // Create a better error message by removing "Enter" from the label if it exists
//           const cleanLabel = currentField.label.toLowerCase().replace(/^enter\s+/i, '');
//           setError(`Please enter a valid ${cleanLabel}`);
//           return false;
//         }
//       } catch (e) {
//         console.error("Invalid regex pattern:", currentField.pattern, e);
//         // If the pattern is invalid, don't block progression
//       }
//     }

//     // Validate password fields specifically
//     if (currentField.type === 'password' && currentData[currentField.name]) {
//       const isPasswordValid = passwordValid[currentField.name];
//       if (isPasswordValid === false) {
//         setError(`Please ensure your password meets all requirements`);
//         return false;
//       }
//     }
//     setError(null);
//     return true;
//   }

//   // Move to next question
//   function goToNextQuestion() {
//     if (formConfirmationReached) return;
//     if (!validateCurrentField()) return;
//     if (!currentField) return;

//     const answerValue = currentData[currentField.name];
//     const answerText = formatBubbleAnswer(currentField, answerValue);

//     // Add user answer to chat
//     setMessages((prev) => [...prev,
//     {
//       sender: 'user',
//       text: answerText,
//       fieldName: currentField.name
//     }
//     ]);

//     if (currentStep === visibleFields.length - 1) {
//       if (props.showConfirmation) {
//         setFormConfirmationReached(true);
//       }
//       return;
//     }

//     const nextStep = currentStep + 1;
//     setCurrentStep(nextStep);
//     const nextField = visibleFields[nextStep];
//     setMessages((prev) => [...prev,
//     {
//       sender: 'bot',
//       text: buildBotPrompt(nextField),
//     }
//     ]);
//   }

//   // Format answer for chat bubble
//   function formatBubbleAnswer(activeField: pageFormData, value: unknown): string {
//     if (activeField.type === "map" && Array.isArray(value) && value.length === 3) {
//       const [, , address] = value;
//       if (address && typeof address === 'object' && 'place_name' in address) {
//         return String(address.place_name);
//       }
//     }

//     if (Array.isArray(value)) {
//       return value.map((item, i) => {
//         if (typeof item === 'object' && item !== null && 'label' in item) {
//           return `${i + 1}. ${item.label}`;
//         }
//         return String(item);
//       }).join(', \n');
//     }

//     if (activeField.type === "password") {
//       const length = String(value).length;
//       return '•'.repeat(length);
//     }
//     return String(value);
//   }

//   // Move to submission confirmation
//   async function goToConfirmation(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null); // Clear any previous errors

//     // Validate that all required fields have values
//     const missingFields = visibleFields
//       .filter(field => !field.isOptional && !currentData[field.name] && currentData[field.name] !== 0)
//       .map(field => field.label);

//     if (missingFields.length > 0) {
//       setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
//       return;
//     }

//     // Validate regex patterns for all fields that have patterns
//     for (const field of visibleFields) {
//       if (field.pattern && currentData[field.name]) {
//         const fieldValue = String(currentData[field.name]);
//         try {
//           const regex = new RegExp(field.pattern);
//           if (!regex.test(fieldValue)) {
//             // Create a better error message by removing "Enter" from the label if it exists
//             const cleanLabel = field.label.toLowerCase().replace(/^enter\s+/i, '');
//             setError(`Please enter a valid ${cleanLabel}`);
//             return;
//           }
//         } catch (e) {
//           console.error("Invalid regex pattern:", field.pattern, e);
//           // If the pattern is invalid, don't block submission
//         }
//       }
//     }

//     // If Terms are required, ensure they are accepted
//     if (props.termsDisclaimer && !isTermsChecked) {
//       setError('Please accept the Terms and Conditions to submit.');
//       return;
//     }

//     // Make API calls for each entry in apiCalls
//     for (const apiCall of props.apiCalls) {
//       try {
//         // Construct the request body using the specified fields
//         const unprocessedRequestBody: Record<string, unknown> = props.apiInterfaceFunction ? props.apiInterfaceFunction(currentData) : currentData;
//         const requestBody = apiCall.body.reduce((acc: Record<string, unknown>, fieldName: string) => {
//           if (unprocessedRequestBody[fieldName] != undefined && unprocessedRequestBody[fieldName] != null) {
//             acc[fieldName] = unprocessedRequestBody[fieldName];
//           } else {
//             acc[fieldName] = "";
//           }
//           return acc;
//         }, {});

//         // Ensure the URL is absolute
//         const absoluteUrl = apiCall.url.startsWith('http://') || apiCall.url.startsWith('https://')
//           ? apiCall.url
//           : `https://${apiCall.url}`;

//         const response = await fetch('/api/proxy', {
//           method: "POST",
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           credentials: 'include',
//           body:
//             JSON.stringify({
//               data: requestBody,
//               url: absoluteUrl,
//               method: apiCall.method
//             })
//         });

//         if (!response.ok) {
//           throw new Error(`API call failed with status ${response.status}`);
//         }
//       } catch (error) {
//         console.error("Error during API call:", error);
//         setError("There was an error submitting the form. Please try again later.");
//         return;
//       }
//     }

//     // If all API calls were successful, refresh session then redirect
//     if (props.redirectUrl) {
//       try {
//         await refreshSession();
//       } catch (e) {
//         console.error('Session refresh failed after registration/login:', e);
//       }
//       router.push(props.redirectUrl);
//     }
//   }

//   // Render input for questions
//   function renderInputField(field: pageFormData | undefined) {
//     if (!field) return null;

//     switch (field.type) {
//       case "calendar":
//         return (
//           <Calendar
//             selectedDate={typeof currentData[field.name] === 'string' ? currentData[field.name] as string : ""}
//             onDateChange={(date: string) => handleFieldUpdate(field.name, date)}
//           />
//         );

//       case "multiSelect":
//         return (
//           <MultiSelect
//             options={field.options || []}
//             selection={Array.isArray(currentData[field.name]) ? currentData[field.name] as string[] : []}
//             onSelect={(selection) => handleFieldUpdate(field.name, selection)}
//             mode={(field.mode as 'single' | 'multiple' | undefined) ?? 'single'}
//           />
//         );

//       case "dropdown":
//         return (
//           <Dropdown
//             options={field.options || []}
//             selection={typeof currentData[field.name] === 'string' || Array.isArray(currentData[field.name]) ? currentData[field.name] as string | string[] : (field.multiple ? [] : "")}
//             onSelect={(option) => handleFieldUpdate(field.name, option)}
//             multiple={field.multiple}
//           />
//         );

//       case "range": {
//         const stored = currentData[field.name];
//         const selection: number | [number, number] =
//           typeof stored === "number" || (Array.isArray(stored) && stored.length === 2)
//             ? (stored as number | [number, number])
//             : field.rangeMode === "multiple"
//               ? (field.defaultValue as [number, number])
//               : (field.defaultValue as number);

//         return (
//           <RangeInput
//             selection={selection}
//             onChange={(value) => handleFieldUpdate(field.name, value)}
//             mode={(field.rangeMode as "single" | "multiple" | undefined) || "single"}
//             min={field.min}
//             max={field.max}
//             step={field.step}
//           />
//         );
//       }

//       case "map":
//         return (
//           <Map
//             coordinates={Array.isArray(currentData[field.name]) ? currentData[field.name] as [number, number, unknown] : [-98.5795, 39.8283, { place_name: 'United States', context: [{ text: 'United States' }, { text: 'United States' }, { text: 'United States' }] }]}
//             setCoordinates={(value) => handleFieldUpdate(field.name, value)}
//             showLocationButton={field.showLocationButton}
//             addressSuggestions={field.addressSuggestions}
//             citySuggestions={field.citySuggestions}
//           />
//         );

//       case "dragList":
//         return (
//           <div className="flex justify-start">
//             <div className="text-black">
//               <DragList
//                 key={field.id}
//                 items={(field.rangeLabels as { label: string; value: number; description?: string }[] | undefined)?.map((item) => ({ label: item.label as string, value: item.value.toString(), description: item.description as string })) || []}
//                 onChange={(value) => handleFieldUpdate(field.name, value)}
//               />
//             </div>
//           </div>
//         );


//       case "photoUpload":
//         return (
//           <PhotoUpload
//             id={field.id}
//             name={field.name}
//             onUpload={(url: string) => handleFieldUpdate(field.name, url)}
//             currentValue={typeof currentData[field.name] === 'string' ? currentData[field.name] as string : undefined}
//           />
//         );

//       case "multiNeighborhood":
//         return (
//           <MultiNeighborhoodInput
//             id={field.id}
//             name={field.name}
//             value={typeof currentData[field.name] === 'string' ? currentData[field.name] as string : ""}
//             onChange={(value: string) => handleFieldUpdate(field.name, value)}
//             placeholder={field.placeholder}
//             maxLength={field.maxLength}
//           />
//         );

//       case "password":
//         return (
//           <PasswordInput
//             id={field.id}
//             name={field.name}
//             value={typeof currentData[field.name] === 'string' ? currentData[field.name] as string : ""}
//             onChange={handleChange}
//             onKeyPress={handleKeyPress}
//             placeholder={field.placeholder}
//             maxLength={field.maxLength}
//             pattern={field.pattern}
//             onValidationChange={(isValid: boolean) => handlePasswordValidation(field.name, isValid)}
//           />
//         );

//       default:
//         return (
//           <FormInput
//             id={field.id}
//             name={field.name}
//             type={field.type || 'text'}
//             value={typeof currentData[field.name] === 'string' ? currentData[field.name] as string : ""}
//             onChange={handleChange}
//             onKeyPress={handleKeyPress}
//             placeholder={field.placeholder}
//             maxLength={field.maxLength}
//             pattern={field.pattern}
//             min={field.min}
//             max={field.max}
//             step={field.step}
//           />
//         );

//     }
//   }

//   const orderedItems = visibleFields
//     .map(f => ({
//       field: f,
//       value: currentData[f.name],
//     }));


//   const progress = (currentStep / Math.max(visibleFields.length - 1, 1)) * 100;

//   // Render component
//   if (formConfirmationReached) {
//     return (
//       <div className="max-w-[500px] mx-auto bg-white rounded-xl shadow-lg flex flex-col h-[500px] overflow-hidden">
//         {/* Progress bar stays for consistency */}
//         <div className="w-full bg-gray-200 h-2">
//           <div
//             className="h-2 bg-orange-500 transition-[width]"
//             style={{ width: "100%" }}
//           />
//         </div>

//         {/* Confirmation scroll area */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           <h2 className="text-xl font-bold text-gray-800">
//             Review your answers
//           </h2>

//           {orderedItems.map(({ field, value }) => (
//             <div key={field.name} className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700">
//               <div className="font-semibold">{field.label}</div>
//               <div className="whitespace-pre-line break-words">

//                 {field.type === "map" &&
//                   Array.isArray(value) &&
//                   value.length === 3 &&
//                   value[2] &&
//                   typeof value[2] === "object" &&
//                   "place_name" in value[2]
//                   ? String((value[2] as { place_name: string }).place_name)

//                   : Array.isArray(value)
//                     ? value
//                       .map((v) => {
//                         // dragList objects
//                         if (typeof v === "object" && v && "label" in v) {
//                           return (v as { label: string }).label;
//                         }

//                         if (field.options) {
//                           const opt = field.options.find(o => String(o.value) === String(v));
//                           return opt ? opt.label : String(v);
//                         }

//                         return String(v);
//                       })
//                       .join(", ")
//                     : field.type === "password"
//                       ? "•".repeat(String(value ?? "").length)
//                       : field.options
//                         ? field.options.find(o => String(o.value) === String(value))?.label ?? String(value ?? "")
//                         : String(value ?? "")
//                 }

//               </div>
//             </div>
//           ))}


//           {props.termsDisclaimer && (
//             <div className="border border-gray-300 rounded-lg p-3">
//               <label className="flex items-start gap-2 text-sm text-gray-800">
//                 <input
//                   type="checkbox"
//                   className="mt-1 h-4 w-4 accent-[#fb5f10]"
//                   checked={isTermsChecked}
//                   onChange={(e) => setIsTermsChecked(e.target.checked)}
//                 />
//                 <span className="flex-1 leading-5">
//                   I have read and agree to the Terms and Conditions.
//                   <button
//                     type="button"
//                     className="px-2 py-0.5 bg-white text-orange-500 hover:bg-orange-400 hover:text-white rounded-lg transition-colors text-sm"
//                     onClick={() => setIsTermsOpen(true)}
//                   >
//                     Read terms
//                   </button>
//                 </span>
//               </label>
//             </div>
//           )}

//           {error && (
//             <div className="p-2 rounded bg-red-100 text-red-700 text-sm">
//               {error}
//             </div>
//           )}
//         </div>

//         {/* Footer buttons */}
//         <form
//           onSubmit={goToConfirmation}
//           className="p-4 border-t flex gap-2 bg-white"
//         >
//           <button
//             type="button"
//             onClick={() => {
//               // let them jump back to last question
//               setFormConfirmationReached(false);
//               setCurrentStep(Math.max(visibleFields.length - 1, 0));
//             }}
//             className="flex-1 border rounded-lg text-gray-700 bg-white hover:bg-gray-100 text-sm font-medium py-2"
//           >
//             Edit Answers
//           </button>
//           <button
//             type="submit"
//             className="flex-1 rounded-lg bg-[#fb5f10] text-white text-sm font-medium py-2 hover:bg-[#e0550e]"
//           >
//             Submit
//           </button>
//         </form>

//         {/* Terms modal */}
//         {props.termsDisclaimer && isTermsOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
//             <div className="bg-white max-w-md w-[90%] max-h-[80vh] rounded-lg shadow-xl flex flex-col overflow-hidden">
//               <div className="flex items-center justify-between p-3 bg-[#fb5f10]">
//                 <h3 className="text-sm font-semibold text-white"> Terms and Conditions </h3>
//                 <button
//                   type="button"
//                   className="text-white/90 hover:text-white"
//                   onClick={() => setIsTermsOpen(false)}
//                 >
//                   ✕
//                 </button>
//               </div>
//               <div className="p-4 overflow-y-auto whitespace-pre-wrap text-gray-800 flex-1 min-h-0">
//                 {props.termsDisclaimer}
//               </div>
//               <div className="p-3 border-t flex justify-end">
//                 <button
//                   type="button"
//                   className="border border-transparent font-medium rounded-lg transition-colors bg-white text-orange-500 hover:bg-orange-400 hover:text-white px-4 py-2"
//                   onClick={() => setIsTermsOpen(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-[650px] mx-auto bg-white rounded-xl shadow-lg flex flex-col h-[500px] overflow-hidden">
//       <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 overscroll-contain">
//         {/* Loop through messages to output (map auto pass) */}
//         {messages.map((msg, i) => {
//           const isUser = msg.sender === "user";
//           const isEditing = isUser && msg.fieldName && editingField === msg.fieldName;

//           return (
//             <div key={i} className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
//               <div className="items-start max-w-[80%]">
//                 <div
//                   className={`inline-block rounded-lg px-3 py-2 text-sm ${isUser
//                     ? "bg-[#fb5f10] text-white cursor-pointer"
//                     : "bg-[#EDEBEB] text-black"
//                     }`}
//                   onClick={() => {
//                     if (!isUser || !msg.fieldName) return;
//                     const f = visibleFields.find(f => f.name === msg.fieldName);
//                     if (f && ["map", "dragList", "photoUpload", "range", "multiSelect", "dropdown"].includes(f.type ?? "")) {
//                       const idx = visibleFields.findIndex(x => x.name === msg.fieldName);
//                       if (idx !== -1) setCurrentStep(idx);
//                       return;
//                     }
//                     beginEdit(msg.fieldName); // this triggers edit mode
//                   }}
//                 >
//                   {!isEditing ? (
//                     <div className="whitespace-pre-wrap break-words">{msg.text}</div>
//                   ) : (
//                     <div className="flex items-center gap-2">
//                       <input
//                         ref={inputRef}
//                         value={editingValue}
//                         onChange={(e) => setEditingValue(e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter") saveEdit();
//                         }}
//                         className="w-[220px] md:w-[280px] px-2 py-1 rounded bg-white text-black"
//                       />
//                     </div>
//                   )}


//                 </div>
//                 <>
//                   {msg.sender === "user" && (
//                     <div className="text-[10px] text-gray-400 italic text-right">Click to edit</div>
//                   )}
//                 </>
//               </div>
//             </div>
//           );
//         })}

//         {/* error inline */}
//         {error && (
//           <div className="text-xs text-red-600 bg-red-50 border-red-200 rounded p-2 max-w-[80%] self-start">
//             {error}
//           </div>
//         )}
//       </div>

//       {/* footer input area */}
//       <div className="border-t bg-white p-4">
//         <div className="mb-3">
//           {renderInputField(currentField)}
//         </div>

//         <div className="flex gap-2">
//           <button
//             type="button"
//             onClick={goToNextQuestion}
//             className="flex-1 rounded-lg bg-[#fb5f10] text-white text-sm font-medium py-2 hover:bg-[#e0550e]"
//           >
//             Next
//           </button>
//         </div>

//         {/* progress bar */}
//         <div className="w-full bg-gray-200 mt-4">
//           <div
//             className="h-2 bg-orange-600 transition-[width]"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }


