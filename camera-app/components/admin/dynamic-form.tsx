"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

// Define the possible field types
export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "date"
  | "datetime"
  | "file"
  | "textarea"
  | "select"
  | "checkbox";

// Define a select option
export type SelectOption = {
  label: string;
  value: string;
};

// Define the field configuration
export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: SelectOption[]; // For select fields
  min?: number; // For number fields or min length
  max?: number; // For number fields or max length
  accept?: string; // For file fields
  validation?: z.ZodTypeAny; // Custom validation
};

// Define the form props
interface DynamicFormProps {
  fields: FieldConfig[];
  onSubmit: (values: any) => void;
  submitButtonText?: string;
  defaultValues?: Record<string, any>;
  title?: string;
  className?: string;
}

export default function DynamicForm({
  fields,
  onSubmit,
  submitButtonText = "Submit",
  defaultValues = {},
  title,
  className,
}: DynamicFormProps) {
  // Dynamically create a schema based on the fields
  const generateZodSchema = () => {
    const schema: Record<string, z.ZodTypeAny> = {};

    fields.forEach((field) => {
      // Start with a base schema based on field type
      let fieldSchema: z.ZodTypeAny;

      switch (field.type) {
        case "text":
          fieldSchema = z.string();
          if (field.min)
            fieldSchema = (fieldSchema as z.ZodString).min(
              field.min,
              `${field.label} must be at least ${field.min} characters.`
            );
          if (field.max)
            fieldSchema = (fieldSchema as z.ZodString).max(
              field.max,
              `${field.label} must not exceed ${field.max} characters.`
            );
          break;
        case "email":
          fieldSchema = z.string().email(`Please enter a valid email address.`);
          break;
        case "password":
          fieldSchema = z.string();
          if (field.min)
            fieldSchema = (fieldSchema as z.ZodString).min(
              field.min,
              `Password must be at least ${field.min} characters.`
            );
          break;
        case "number":
          fieldSchema = z.coerce.number();
          if (field.min !== undefined)
            fieldSchema = (fieldSchema as z.ZodNumber).min(
              field.min,
              `${field.label} must be at least ${field.min}.`
            );
          if (field.max !== undefined)
            fieldSchema = (fieldSchema as z.ZodNumber).max(
              field.max,
              `${field.label} must not exceed ${field.max}.`
            );
          break;
        case "tel":
          fieldSchema = z.string();
          if (field.min)
            fieldSchema = (fieldSchema as z.ZodString).min(
              field.min,
              `Phone number must be at least ${field.min} digits.`
            );
          break;
        case "url":
          fieldSchema = z.string().url(`Please enter a valid URL.`);
          break;
        case "date":
        case "datetime":
          fieldSchema = z.date({
            required_error: `${field.label} is required.`,
            invalid_type_error: `${field.label} must be a valid date.`,
          });
          break;
        case "file":
          // For file inputs, we'll handle validation separately
          fieldSchema = z.any();
          break;
        case "textarea":
          fieldSchema = z.string();
          if (field.min)
            fieldSchema = (fieldSchema as z.ZodString).min(
              field.min,
              `${field.label} must be at least ${field.min} characters.`
            );
          if (field.max)
            fieldSchema = (fieldSchema as z.ZodString).max(
              field.max,
              `${field.label} must not exceed ${field.max} characters.`
            );
          break;
        case "select":
          fieldSchema = z.string({
            required_error: `Please select a ${field.label.toLowerCase()}.`,
          });
          break;
        case "checkbox":
          fieldSchema = z.boolean().default(false);
          break;
        default:
          fieldSchema = z.string();
      }

      // Use custom validation if provided
      if (field.validation) {
        fieldSchema = field.validation;
      }

      // Make the field optional if not required
      if (!field.required) {
        if (field.type === "checkbox") {
          // For checkboxes, we still want to keep the default value
          fieldSchema = (fieldSchema as z.ZodBoolean).optional().default(false);
        } else if (field.type === "date" || field.type === "datetime") {
          // For dates, we need special handling
          fieldSchema = z.date().optional();
        } else {
          fieldSchema = fieldSchema.optional();
        }
      }

      schema[field.name] = fieldSchema;
    });

    return z.object(schema);
  };

  const formSchema = generateZodSchema();

  // Prepare default values
  const prepareDefaultValues = () => {
    const values: Record<string, any> = {};

    fields.forEach((field) => {
      // Set default from provided defaultValues or empty value based on type
      if (field.name in defaultValues) {
        values[field.name] = defaultValues[field.name];
      } else {
        switch (field.type) {
          case "checkbox":
            values[field.name] = false;
            break;
          case "number":
            values[field.name] = field.required ? 0 : undefined;
            break;
          case "date":
          case "datetime":
            values[field.name] = undefined;
            break;
          default:
            values[field.name] = "";
        }
      }
    });

    return values;
  };

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: prepareDefaultValues(),
  });

  // Render the appropriate field component based on field type
  const renderFieldByType = (field: FieldConfig) => {
    switch (field.type) {
      case "textarea":
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={field.placeholder}
                    className="min-h-24"
                    {...formField}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "select":
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          field.placeholder ||
                          `Select ${field.label.toLowerCase()}`
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "checkbox":
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                <FormControl>
                  <Checkbox
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{field.label}</FormLabel>
                  {field.description && (
                    <FormDescription>{field.description}</FormDescription>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "date":
      case "datetime":
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{field.label}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !formField.value && "text-muted-foreground"
                        )}
                      >
                        {formField.value ? (
                          format(formField.value, "yyyy-MM-dd") // Format as simple date string
                        ) : (
                          <span>{field.placeholder || "Select a date"}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formField.value}
                      onSelect={(date) => {
                        formField.onChange(date);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "file":
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: { value, onChange, ...formField } }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept={field.accept}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      onChange(file);
                    }}
                    {...formField}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        // Handle all other text-based inputs (text, email, password, number, tel, url)
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    {...formField}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <div
      className={cn(
        "max-w-md mx-auto p-6 bg-white rounded-lg shadow-md",
        className
      )}
    >
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {fields.map(renderFieldByType)}

          <Button type="submit" className="w-full">
            {submitButtonText}
          </Button>
        </form>
      </Form>
    </div>
  );
}
