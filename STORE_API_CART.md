# WooCommerce Store API Cart Integration

## Overview

Implemented cart functionality using **WooCommerce Store API** (available in WooCommerce 5.0+).

## Changes Made

### Backend Cart Routes (`backend/src/routes/cart.ts`)
- ✅ Replaced placeholder endpoints with actual Store API calls
- ✅ Created separate axios client for Store API
- ✅ Implemented all cart operations

### API Endpoints

| Operation | Backend Route | Store API Endpoint |
|-----------|---------------|-------------------|
| Get Cart | `GET /api/cart` | `GET /wc/store/v1/cart` |
| Add to Cart | `POST /api/cart` | `POST /wc/store/v1/cart/add-item` |
| Update Item | `PUT /api/cart/:key` | `POST /wc/store/v1/cart/update-item` |
| Remove Item | `DELETE /api/cart/:key` | `DELETE /wc/store/v1/cart/items/:key` |
| Clear Cart | `DELETE /api/cart` | `DELETE /wc/store/v1/cart/items` |

## Important Notes

### Store API vs REST API

**Store API** (for cart/checkout):
- Endpoint: `/wp-json/wc/store/v1/`
- Authentication: Uses cookies/sessions (no auth needed for guest carts)
- Built into WooCommerce 5.0+

**REST API** (for products/orders):
- Endpoint: `/wp-json/wc/v3/`
- Authentication: OAuth 1.0a (consumer key/secret)
- What we use for products

### Session Management

The Store API uses **WordPress sessions** to track carts:
- Guest users get a session cookie
- Cart persists during session
- Backend must forward cookies between requests

### CORS Considerations

Since frontend and backend are on different domains, cookies might not work by default. Solutions:

1. **Set credentials in axios** (already configured)
2. **Enable CORS with credentials** in backend (already configured)
3. **Backend acts as proxy** - Store API cookies stay on backend

## Testing

### 1. Verify Store API is Available

```bash
curl https://your-store.com/wp-json/wc/store/v1/cart
```

**Expected:** Cart data or empty cart JSON

### 2. Test Add to Cart

```bash
curl -X POST http://localhost:3001/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": 123, "quantity": 1}'
```

**Expected:** Cart response with added item

### 3. Test Frontend Integration

1. Start backend: `cd backend && npm run dev`
2. Navigate to product page
3. Click "Add to Cart"
4. Check browser console and network tab

## Known Limitations

### Session Cookie Handling

Since the backend proxies Store API requests, session cookies need special handling:

**Problem:** Store API returns `Set-Cookie` to backend, but frontend doesn't receive it.

**Solutions:**

**Option A: Session Forwarding** (Complex)
- Backend forwards cookies from Store API to frontend
- Requires cookie parsing and re-setting

**Option B: Backend Session Storage** (Recommended for production)
- Backend stores cart data with session ID
- Frontend sends session ID in headers
- Backend includes session in Store API calls

**Option C: Use WooCommerce Nonces** (For authenticated users)
- Requires user authentication
- WooCommerce handles sessions automatically

## Next Steps

1. ✅ Backend routes updated
2. ⏳ Test with real WooCommerce store
3. ⏳ Handle session cookies if needed
4. ⏳ Update frontend error handling for Store API responses

## Resources

- [WooCommerce Store API Docs](https://github.com/woocommerce/woocommerce-blocks/blob/trunk/docs/third-party-developers/extensibility/rest-api/store-api.md)
- [Cart Endpoints](https://github.com/woocommerce/woocommerce-blocks/blob/trunk/docs/third-party-developers/extensibility/rest-api/store-cart.md)
