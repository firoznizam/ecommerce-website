import { CartItem, Product, StoreSettings } from '../types';

/**
 * Generates an encoded WhatsApp URL with contextual pre-filled messages
 */
export function buildWhatsAppUrl(phoneDigits: string, text: string): string {
  // Strip any non-digit characters except leading plus if any
  const cleanPhone = phoneDigits.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function getGeneralEnquiryWhatsAppUrl(settings: StoreSettings): string {
  const message = `Hello ${settings.shopName}! 👋\nI am browsing your online store and would like to ask a general question about your fresh produce and today's deliveries.`;
  return buildWhatsAppUrl(settings.whatsappNumber, message);
}

export function getProductEnquiryWhatsAppUrl(product: Product, settings: StoreSettings): string {
  const message = `Hello ${settings.shopName}! 👋\nI am inquiring about *${product.name}* (ID: ${product.id}).\nCurrent listed retail price: ${settings.currencySymbol}${product.retailPrice.toFixed(2)} / ${product.unit}.\nIs this batch available for immediate dispatch today?`;
  return buildWhatsAppUrl(settings.whatsappNumber, message);
}

export function getUnavailableProductWhatsAppUrl(product: Product, settings: StoreSettings): string {
  const message = `Hello ${settings.shopName}! ⚠️\nI noticed *${product.name}* is currently out of stock or requires confirmation.\nPlease let me know when fresh stock arrives or if you have an alternative produce available!`;
  return buildWhatsAppUrl(settings.whatsappNumber, message);
}

export function getWholesaleEnquiryWhatsAppUrl(
  companyName: string,
  businessType: string,
  estimatedKg: string,
  settings: StoreSettings
): string {
  const message = `🏢 *WHOLESALE SUPPLY INQUIRY*\n---------------------------\nBusiness: ${companyName || 'Wholesale Client'}\nType: ${businessType || 'Restaurant/Hotel/Store'}\nEstimated Daily Volume: ${estimatedKg || '50+'} kg\n\nHello ${settings.shopName} team, we would like to receive your official wholesale price list and discuss regular daily commercial deliveries.`;
  return buildWhatsAppUrl(settings.whatsappNumber, message);
}

export function getBulkQuickOrderWhatsAppUrl(
  items: { product: Product; quantity: number }[],
  clientName: string,
  settings: StoreSettings
): string {
  let list = items
    .filter((it) => it.quantity > 0)
    .map(
      (it, idx) =>
        `${idx + 1}. *${it.product.name}*: ${it.quantity} ${it.product.unit} (Approx ${settings.currencySymbol}${(
          it.quantity * (it.quantity >= it.product.minWholesaleQty ? it.product.wholesalePrice : it.product.retailPrice)
        ).toFixed(2)})`
    )
    .join('\n');

  const message = `📦 *WHOLESALE BULK QUICK ORDER*\n---------------------------\nClient: ${clientName || 'Commercial Buyer'}\nItems Requested:\n${list}\n\nPlease confirm stock availability, harvest batch time, and delivery scheduling for this bulk order. Thank you!`;
  return buildWhatsAppUrl(settings.whatsappNumber, message);
}

export function getCartOrderWhatsAppUrl(
  cart: CartItem[],
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    slot: string;
  },
  subtotal: number,
  deliveryFee: number,
  discount: number,
  total: number,
  settings: StoreSettings
): string {
  const itemsList = cart
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} — ${item.quantity} ${item.product.unit} @ ${settings.currencySymbol}${(
          item.quantity >= item.product.minWholesaleQty ? item.product.wholesalePrice : item.product.retailPrice
        ).toFixed(2)} = ${settings.currencySymbol}${(
          item.quantity * (item.quantity >= item.product.minWholesaleQty ? item.product.wholesalePrice : item.product.retailPrice)
        ).toFixed(2)}`
    )
    .join('\n');

  const message = `🛒 *NEW PRODUCE ORDER — ${settings.shopName}*\n-------------------------------------\n*Customer:* ${customerInfo.name || 'Guest'}\n*Phone:* ${customerInfo.phone || 'Provided at checkout'}\n*Delivery Address:* ${customerInfo.address || 'Standard Delivery'}\n*Preferred Slot:* ${customerInfo.slot || 'Earliest available'}\n\n*Order Items:*\n${itemsList}\n\n-------------------------------------\n*Subtotal:* ${settings.currencySymbol}${subtotal.toFixed(2)}\n*Delivery Fee:* ${settings.currencySymbol}${deliveryFee.toFixed(2)}\n${discount > 0 ? `*Discount:* -${settings.currencySymbol}${discount.toFixed(2)}\n` : ''}*Total Amount:* ${settings.currencySymbol}${total.toFixed(2)}\n\nPlease confirm our order dispatch!`;

  return buildWhatsAppUrl(settings.whatsappNumber, message);
}

export function getOrderTrackingWhatsAppUrl(orderNo: string, settings: StoreSettings): string {
  const message = `Hello ${settings.shopName}! 🚚\nI would like an update on my order *${orderNo}*.\nCould you please check dispatch status with the delivery driver?`;
  return buildWhatsAppUrl(settings.whatsappNumber, message);
}
