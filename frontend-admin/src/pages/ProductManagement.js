import { useState, useEffect } from 'react';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import api from '../api';
import axios from 'axios';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        ProductName: '',
        CategoryID: '',
        Price: '',
        Stock: '',
        Description: '',
        ImageURL: '',
        Status: ''
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [error, setError] = useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                setError('Không thể tải danh sách sản phẩm.');
            }
        };
        fetchProducts();
    }, []);

    const addProduct = async () => {
        try {
            const response = await api.post('/products', newProduct);
            setProducts([...products, response.data]);
            setNewProduct({ 
                ProductName: '', 
                CategoryID: '', 
                Price: '', 
                Stock: '', 
                Description: '', 
                ImageURL: '', 
                Status: '' 
            });
            setOpenAddDialog(false);
        } catch (error) {
            console.error('Error adding product:', error);
            setError(error.response?.data?.message || 'Không thể thêm sản phẩm.');
        }
    };
    const handleEditClick = (product) => {
        setSelectedProduct({
            ProductName: product.ProductName,
            CategoryID: product.CategoryID,
            Price: product.Price,
            Stock: product.Stock,
            Description: product.Description,
            ImageURL: product.ImageURL,
            Status: product.Status
        });
        setSelectedProductId(product.ProductID);
        setOpenEditDialog(true);
    };
    const editProduct = async () => {
        if (!selectedProductId || !selectedProduct) return; // Kiểm tra ID và sản phẩm đã chọn
    
        try {
            const response = await api.put(`/products/${selectedProductId}`, selectedProduct);
            setProducts(products.map(product => 
                product.ProductID === selectedProductId ? response.data : product
            ));
            setSelectedProduct(null);
            setOpenEditDialog(false);
        } catch (error) {
            console.error('Error updating product:', error);
            setError(error.response?.data?.message || 'Không thể cập nhật sản phẩm.');
        }
    };
    
    const deleteProduct = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(product => product.ProductID !== id));
            setOpenDialog(false);
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Không thể xóa sản phẩm.');
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedProductId(id);
        setOpenDialog(true);
    };

    

    return (
        <div>
            <Button 
                onClick={() => setOpenAddDialog(true)} 
                style={{ height: '30px', marginLeft: '10px', marginTop: 100 }}
            >
                Thêm Sản Phẩm
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"><strong>Tên sản phẩm</strong></TableCell>
                            <TableCell align="center"><strong>Danh mục ID</strong></TableCell>
                            <TableCell align="center"><strong>Giá</strong></TableCell>
                            <TableCell align="center"><strong>Tồn kho</strong></TableCell>
                            <TableCell align="center"><strong>Mô tả</strong></TableCell>
                            <TableCell align="center"><strong>Hình ảnh</strong></TableCell>
                            <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                            <TableCell align="center"><strong>Sửa</strong></TableCell>
                            <TableCell align="center"><strong>Xóa</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.ProductID}>
                                <TableCell align="center">{product.ProductName}</TableCell>
                                <TableCell align="center">{product.CategoryID}</TableCell>
                                <TableCell align="center">{product.Price} VND</TableCell>
                                <TableCell align="center">{product.Stock}</TableCell>
                                <TableCell align="center">{product.Description}</TableCell>
                                <TableCell align="center">
                                    <img src={product.ImageURL} alt={product.ProductName} style={{ width: 50, height: 50 }} />
                                </TableCell>
                                <TableCell align="center">{product.Status}</TableCell>
                                <TableCell align="center">
                                    <Button onClick={() => handleEditClick(product)} style={{ marginRight: '10px' }}>Sửa</Button>
                                </TableCell>
                                <TableCell align="center">
                                    <Button onClick={() => handleDeleteClick(product.ProductID)}>Xóa</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

             {/* Hộp thoại thêm sản phẩm */}
             <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>Thêm Sản Phẩm</DialogTitle>
                <DialogContent>
                    <TextField 
                        label="Tên sản phẩm" 
                        value={newProduct.ProductName} 
                        onChange={(e) => setNewProduct({ ...newProduct, ProductName: e.target.value })} 
                        fullWidth 
                    />
                    <TextField 
                        label="Danh mục ID" 
                        value={newProduct.CategoryID} 
                        onChange={(e) => setNewProduct({ ...newProduct, CategoryID: e.target.value })} 
                        fullWidth 
                    />
                    <TextField 
                        label="Giá" 
                        type="number"
                        value={newProduct.Price} 
                        onChange={(e) => setNewProduct({ ...newProduct, Price: e.target.value })} 
                        fullWidth 
                    />
                    <TextField 
                        label="Tồn kho" 
                        type="number"
                        value={newProduct.Stock} 
                        onChange={(e) => setNewProduct({ ...newProduct, Stock: e.target.value })} 
                        fullWidth 
                    />
                    <TextField 
                        label="Mô tả" 
                        value={newProduct.Description} 
                        onChange={(e) => setNewProduct({ ...newProduct, Description: e.target.value })} 
                        fullWidth 
                    />
                    <TextField 
                        label="Hình ảnh (URL)" 
                        value={newProduct.ImageURL} 
                        onChange={(e) => setNewProduct({ ...newProduct, ImageURL: e.target.value })} 
                        fullWidth 
                    />
                    <TextField 
                        label="Trạng thái" 
                        value={newProduct.Status} 
                        onChange={(e) => setNewProduct({ ...newProduct, Status: e.target.value })} 
                        fullWidth 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)} color="primary">Hủy</Button>
                    <Button onClick={addProduct} color="primary">Thêm</Button>
                </DialogActions>
            </Dialog>

            {/* Hộp thoại sửa sản phẩm */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Cập nhập Sản Phẩm</DialogTitle>
                <DialogContent>
                    <TextField 
                        label="Tên sản phẩm" 
                        value={selectedProduct?.ProductName} 
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, ProductName: e.target.value })} 
                        fullWidth 
                    />
                    <TextField 
                        label="Danh mục ID" 
                        value={selectedProduct?.CategoryID} 
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, CategoryID: e.target.value })} 
                        fullWidth 
                    />
                    <TextField 
                        label="Giá" 
                        type="number"
                        value={selectedProduct?.Price} 
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, Price: e.target.value })} 
                        fullWidth 
                    />
                    <TextField 
                        label="Tồn kho" 
                        type="number"
                        value={selectedProduct?.Stock} 
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, Stock: e.target.value })} 
                        fullWidth 
                    />
                    <TextField 
                        label="Mô tả" 
                        value={selectedProduct?.Description} 
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, Description: e.target.value })} 
                        fullWidth 
                    />
                    <TextField 
                        label="Hình ảnh (URL)" 
                        value={selectedProduct?.ImageURL} 
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, ImageURL: e.target.value })} 
                        fullWidth 
                    />
                    <TextField 
                        label="Trạng thái" 
                        value={selectedProduct?.Status} 
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, Status: e.target.value })} 
                        fullWidth 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} color="primary">Hủy</Button>
                    <Button onClick={editProduct} color="primary">Lưu</Button>
                </DialogActions>
            </Dialog>

            {/* Hộp thoại xác nhận xóa sản phẩm */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Xác Nhận Xóa</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa sản phẩm này?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">Hủy</Button>
                    <Button onClick={() => deleteProduct(selectedProductId)} color="primary">Xóa</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProductManagement;
