export const business = {
  name: "EL Print",
  legalName: "EL Print Pte Ltd",
  addressLines: ["15 Lorong 8 Toa Payoh", "#07-08 Braddell Tech", "Singapore 319262"],
  address: "15 Lorong 8 Toa Payoh, #07-08 Braddell Tech, Singapore 319262",
  phone: "+65 6100 5225",
  phoneHref: "tel:+6561005225",
  whatsapp: "+65 8699 6813",
  whatsappHref: "https://wa.me/6586996813",
  email: "sales@elprint.sg",
  emailHref: "mailto:sales@elprint.sg",
  hours: "Mon–Fri, 9:30 AM – 6:30 PM",
  hoursNote: "Closed weekends and public holidays",
  brands: ["Gildan", "Ultra Fresh", "North Harbour"],
  mapEmbed:
    "https://www.google.com/maps?q=15+Lorong+8+Toa+Payoh+Braddell+Tech+Singapore+319262&output=embed",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=15+Lorong+8+Toa+Payoh+Braddell+Tech+Singapore+319262",
} as const;

export const navLinks = [
  { label: "Shop", href: "/shop/" },
  { label: "Services", href: "/services/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Design Lab", href: "/design/" },
  { label: "Delivery", href: "/delivery/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
] as const;

export const footerLinks = [
  { label: "Shop", href: "/shop/" },
  { label: "Services", href: "/services/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Delivery", href: "/delivery/" },
  { label: "Contact", href: "/contact/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Privacy", href: "/privacy/" },
  { label: "Terms", href: "/terms/" },
] as const;

export function whatsappLink(message: string) {
  return `${business.whatsappHref}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body: string) {
  return `${business.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
