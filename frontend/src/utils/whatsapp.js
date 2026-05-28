const WA_NUMBER = '94723303946'; // +94 723303946

/**
 * Build a wa.me link with a pre-filled message.
 */
export const buildWhatsAppLink = (message) => {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
};

/**
 * Generate a WhatsApp order message for a single product.
 */
export const productWhatsAppMessage = (product, quantity = 1, color = '') => {
  const finalPrice = product.discount > 0
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : Math.round(product.price);

  const lines = [
    `👋 Hello! I'd like to purchase the following item from Anura Furniture:`,
    ``,
    `🛋️ *${product.name}*`,
    color ? `   Color: ${color}` : '',
    `   Quantity: ${quantity}`,
    `   Price: Rs. ${(finalPrice * quantity).toLocaleString()}`,
    ``,
    `🔗 ${window.location.href}`,
    ``,
    `Please let me know how to proceed. Thank you!`,
  ].filter((l) => l !== undefined);

  return lines.join('\n');
};

/**
 * Generate a WhatsApp order message for a full cart.
 */
export const cartWhatsAppMessage = (items, subtotal, shipping) => {
  const itemLines = items.map(
    (item, i) =>
      `${i + 1}. *${item.name}* x${item.quantity} – Rs. ${Math.round(item.price * item.quantity).toLocaleString()}`
  );

  const total = subtotal + shipping;

  const lines = [
    `👋 Hello! I'd like to order the following items from Anura Furniture:`,
    ``,
    ...itemLines,
    ``,
    `💰 Subtotal: Rs. ${Math.round(subtotal).toLocaleString()}`,
    `🚚 Delivery: ${shipping === 0 ? 'FREE' : `Rs. ${shipping}`}`,
    `✅ *Total: Rs. ${Math.round(total).toLocaleString()}*`,
    ``,
    `Please guide me through the purchase. Thank you!`,
  ];

  return lines.join('\n');
};
