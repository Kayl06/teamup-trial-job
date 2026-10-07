Time: about 7.5 hours, including writing this README.

I started at 3:30pm and finished the mobile and desktop versions by 10pm. I set up the dev store, pulled the Horizon theme with the CLI, and connected that theme to GitHub. I did not start from a blank theme, as the instructions said.

Decisions:
- Product images: I added a new gallery option so I would not change the default theme option. On desktop, the first image is full width and the rest sit in two columns. The mobile version has thumbnails, so I follow that design and added in the option too.
- I made a metaobject for product review videos and used it in a custom product metafield, so each product can have its own review videos.
- Product details are a new block, _product-details_v2, made of nested blocks so the column can be edited in the theme editor. The original details block is still used on featured products.
- Buy 1 / Buy 2 / Buy 3 are quantity breaks from the variant price (full price, 15% off, 20% off) and can be set in the block settings. The selected card sets the quantity and the button price.
- Recommendations reuse the theme slideshow. Desktop shows 4 cards and moves one card at a time. If Shopify recommendations are empty, it falls back so products still show.

Trade-offs:
- Rating stars and the Afterpay line are static HTML. The accordion text is placeholder.
- Suitable for and Use it are content in the theme editor, not separate product metafields yet.

AI:
- I used Cursor on the gallery, details, carousel video reviews, purchase options, recommendations, and the mobile version.
- After review I changed spacing, text alignment, and font sizes, fixed the accordion animation, and added assets in the admin: example product images, posters and video thumbnails, and video URLs in the metaobjects.

With more time I would move Suitable for, Use it, and the accordion copy into product metafields, hook up real review data, and monitor PDP performance.

Preview: https://teamup-trial-job.myshopify.com/
Password: teeffa
Loom Video: https://www.loom.com/share/87bd5cb52526427e92e4867d734b9e1e