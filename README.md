# Mock Shopify Server
Solution to Shopify Summer 2019 Backend Developer Challenge

<b> General Usage </b>
</br>
All product handling is done through carts, so you'll need to create one before adding or removing any products.
However, product querying can be done at anytime, without the need for a cart.
Product inventory is only updated internally after a cart is brought to checkout.

<b> Product Querying </b>

Query by Title:
</br>
&nbsp;&nbsp;&nbsp;&nbsp; POST Request: /querybytitle
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Returns: List of products that include the search query in their title
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Parameters:
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • title: Keyword to search for amongst product titles
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • onlyInStock: Whether to only return products that are in stock
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Error Codes:
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • 400: Any number of parameters are unspecified

Query by Price:
</br>
&nbsp;&nbsp;&nbsp;&nbsp; POST Request: /querybyprice
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Returns: List of products within a price range specified by the price query and threshold
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Parameters:
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • price: Price (as a Number) to search for products from
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • threshold: What type of prices relative to the price query to match products from
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "exact": Match products with prices equal to the price query
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "above": Match products with prices greater than or equal to the price query
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "below": Match products with prices less than or equal to the price query
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • onlyInStock: Whether to only return products that are in stock
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Error Codes:
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • 400: Any number or parameters are unspecified or illegal (i.e. price is not a Number)

<b> Cart Usage </b>

Creating a Cart:
</br>
&nbsp;&nbsp;&nbsp;&nbsp; POST Request: /createcart
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Returns: An empty cart with a product list [empty] and a total [$0.00]
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Parameters:
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • None
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Error Codes:
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • None

Adding a Product to a Cart:
</br>
&nbsp;&nbsp;&nbsp;&nbsp; POST Request: /addcart
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Returns: Updated cart with added product and updated total
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Parameters:
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • cart: Cart to be updated
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • product: Title of product to be added to cart
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Error Codes:
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • 400: Product already exists in cart
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • 403: Cart is unspecified
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • 404: Product does not exist or is not in stock

Removing a Product from a Cart:
</br>
&nbsp;&nbsp;&nbsp;&nbsp; POST Request: /removecart
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Returns: Updated cart with removed product and updated total
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Parameters:
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • cart: Cart to be updated
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • product: Title of product to be removed from cart
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Error Codes:
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • 400: Product is not in cart
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • 403: Cart is unspecified

Checking out a  Cart:
</br>
&nbsp;&nbsp;&nbsp;&nbsp; POST Request: /checkoutcart
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Returns: Nothing (OK on success)
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Parameters:
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • cart: Cart to checkout
</br>
&nbsp;&nbsp;&nbsp;&nbsp; Error Codes:
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • 403: Cart is unspecified or checking out 1 or more nonexistant products
</br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • 404: 1 or more products are not in stock
