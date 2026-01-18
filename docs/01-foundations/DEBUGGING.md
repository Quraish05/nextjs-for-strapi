# Debugging GraphQL Requests

Guide on how to view and debug GraphQL requests in your Next.js application.

## Why Server Requests Aren't in Browser Network Tab

When using **Server Components**, GraphQL requests execute on the **server**, not in the browser:
- ✅ Faster performance (data fetched before page renders)
- ✅ Better SEO (content in HTML)
- ❌ Not visible in browser Network tab (requests happen server-side)

## How to View Server-Side Requests

### 1. Terminal Logs (Primary Method)

The server-side GraphQL client logs all requests in your terminal where you run `npm run dev`.

**Example Output:**
```
✅ [GraphQL Success]
   Operation: GetRecipes
   Duration: 45ms
   Response Keys: recipes
   recipes: Array[3]
      Sample keys: documentId, title, createdAt, updatedAt, publishedAt
   Response Data: { recipes: [...] }
```

**What Gets Logged:**
- ✅ Success/failure status
- ✅ Operation name
- ✅ Response time (duration)
- ✅ Response structure (keys, array lengths)
- ✅ Full response data (truncated if > 1000 chars)
- ❌ Errors with full details

### 2. Strapi Logs

Check your Strapi terminal output to see:
- Incoming GraphQL requests
- Query details
- Response times
- Backend errors

### 3. Browser Network Tab (For Client Components Only)

Client Components using Apollo Client will show requests in the browser Network tab:
- Open DevTools → Network tab
- Filter by "graphql" or "fetch"
- See request/response details

**Note:** Server Component requests won't appear here.

## Logging Details

### Success Logs

```
✅ [GraphQL Success]
   Operation: GetRecipes
   Duration: 52ms
   Response Keys: recipes
   recipes: Array[3]
      Sample keys: documentId, title, createdAt...
   Response Data: { recipes: [...] }
```

### Error Logs

```
❌ [GraphQL Query Errors]
   Operation: GetRecipes
   Duration: 23ms
   Errors: [
     {
       "message": "Cannot query field 'xyz' on type 'Recipe'"
     }
   ]
   Variables: { ... }
```

### HTTP Error Logs

```
❌ [GraphQL Request Failed]
   Operation: GetRecipes
   Status: 500 Internal Server Error
   Duration: 120ms
   Response: { error details }
```

## Comparison: Server vs Client

| Aspect | Server Components | Client Components |
|--------|------------------|-------------------|
| **Where requests execute** | Server | Browser |
| **Visible in Network tab** | ❌ No | ✅ Yes |
| **Visible in terminal** | ✅ Yes | ❌ No |
| **Initial load speed** | ⚡ Fast | 🐌 Slower |
| **SEO** | ✅ Good | ❌ Poor |

## Quick Debug Checklist

1. ✅ Check terminal where `npm run dev` is running
2. ✅ Look for `✅ [GraphQL Success]` or `❌ [GraphQL Error]` messages
3. ✅ Verify Strapi is running and accessible
4. ✅ Check GraphQL endpoint URL in logs
5. ✅ Review error messages for specific issues

## Troubleshooting

### No Logs Appearing?

- Ensure `NODE_ENV=development` (default in dev mode)
- Check that requests are actually being made
- Verify the GraphQL client is being called

### Requests Failing?

- Check Strapi is running on correct port (http://localhost:1337)
- Verify GraphQL permissions in Strapi admin
- Check network connectivity between Next.js and Strapi
- Review error messages in terminal logs

### Want to See in Browser?

For debugging purposes, you can:
- Use the API route proxy (`/api/graphql`) from Client Components
- Temporarily convert to Client Component for debugging
- **Remember:** Switch back to Server Component for production!

## Best Practices

**For Development:**
- ✅ Use terminal logs to debug server-side requests
- ✅ Check Strapi logs for backend issues
- ✅ Use browser Network tab only for client-side requests

**For Production:**
- ✅ Keep using Server Components (better performance)
- ✅ Monitor server logs for production debugging
- ✅ Use error tracking services (Sentry, etc.) for production errors

## Summary

- **Server Components**: View logs in terminal (where `npm run dev` runs)
- **Client Components**: View in browser Network tab
- **Both**: Check Strapi logs for backend issues

The terminal is your primary tool for debugging Server Component requests!

