CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");
CREATE INDEX "Coupon_categoryId_idx" ON "Coupon"("categoryId");
CREATE INDEX "Coupon_productId_idx" ON "Coupon"("productId");

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;
