// src/components/StructuredData.tsx
import * as React from "react";

/** JSON-serializable types (no `any`) */
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface JsonObject { [key: string]: JsonValue }
export type JsonArray = JsonValue[];

/** A JSON-LD object is just a JSON object */
export type JsonLdObject = JsonObject;

export type StructuredDataProps = {
  /** Single JSON-LD object or an array of objects */
  data?: JsonLdObject | JsonLdObject[];
  /** Optional children to render after the <script> tags */
  children?: React.ReactNode;
};

/**
 * Renders one or more <script type="application/ld+json"> tags.
 * Safe to place inside <head> in App Router.
 */
export default function StructuredData({ data, children }: StructuredDataProps) {
  const list: JsonLdObject[] = Array.isArray(data) ? data : data ? [data] : [];

  return (
    <>
      {list.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
      {children}
    </>
  );
}
