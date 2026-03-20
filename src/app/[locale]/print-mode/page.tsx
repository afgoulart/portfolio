import PrintModeContent from "./PrintModeContent";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

export default function PrintModePage() {
  return <PrintModeContent />;
}
