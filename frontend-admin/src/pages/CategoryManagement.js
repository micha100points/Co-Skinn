import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Fade,
  Grow,
  Grid,
  Menu,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import api from "../api";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isAddMode, setIsAddMode] = useState(true);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortOption, setSortOption] = useState("alphabetical");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories", {
          params: {
            search: searchTerm,
            sort: sortOption,
          },
        });
        setCategories(response.data);
      } catch (error) {
        setError("Không thể tải danh sách danh mục.");
      }
    };
    fetchCategories();
  }, [searchTerm, sortOption]);

  // Filtered categories (client-side additional filtering if needed)
  const filteredCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        category.CategoryName.toLowerCase().includes(
          searchTerm.toLowerCase()
        ) ||
        category.Description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Vui lòng nhập tên danh mục");
      return;
    }
    try {
      const response = await api.post("/categories/add", {
        CategoryName: newCategoryName,
        Description: newDescription,
      });
      setCategories([...categories, response.data]);
      resetForm();
    } catch (error) {
      setError("Không thể thêm danh mục.");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(
        categories.filter((category) => category.CategoryID !== id)
      );
      setOpenDeleteDialog(false);
    } catch (error) {
      setError("Không thể xóa danh mục.");
    }
  };

  const updateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Vui lòng nhập tên danh mục");
      return;
    }
    try {
      const response = await api.put(`/categories/${editingCategoryId}`, {
        CategoryName: newCategoryName,
        Description: newDescription,
      });
      setCategories(
        categories.map((category) =>
          category.CategoryID === editingCategoryId ? response.data : category
        )
      );
      resetForm();
    } catch (error) {
      setError("Không thể cập nhật danh mục.");
    }
  };

  const resetForm = () => {
    setNewCategoryName("");
    setNewDescription("");
    setEditingCategoryId(null);
    setOpenDialog(false);
    setIsAddMode(true);
    setError("");
  };

  const handleEditCategory = (category) => {
    setNewCategoryName(category.CategoryName);
    setNewDescription(category.Description);
    setEditingCategoryId(category.CategoryID);
    setIsAddMode(false);
    setOpenDialog(true);
  };

  const handleSortMenuOpen = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortOptionChange = (option) => {
    setSortOption(option);
    handleSortMenuClose();
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Quản lý danh mục
        </Typography>
      </Box>
      <Box
        component={motion.div}
        sx={{
          mb: 4,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Grid item xs={12} sm={8} container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="standard"
                placeholder="Tìm kiếm danh mục"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<SortIcon />}
                onClick={handleSortMenuOpen}
              >
                Sắp xếp
              </Button>
              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={handleSortMenuClose}
              >
                <MenuItem
                  selected={sortOption === "alphabetical"}
                  onClick={() => handleSortOptionChange("alphabetical")}
                >
                  Theo bảng chữ cái
                </MenuItem>
                <MenuItem
                  selected={sortOption === "newest"}
                  onClick={() => handleSortOptionChange("newest")}
                >
                  Mới nhất
                </MenuItem>
              </Menu>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => {
                  setIsAddMode(true);
                  setOpenDialog(true);
                }}
              >
                Thêm Mới
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên danh mục</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <Grow key={category.CategoryID} in={true}>
                  <TableRow component={motion.tr} whileHover={{ scale: 1.02 }}>
                    <TableCell>{category.CategoryName}</TableCell>
                    <TableCell>{category.Description}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditCategory(category)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setSelectedCategoryId(category.CategoryID);
                            setOpenDeleteDialog(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                </Grow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Category Dialog */}
        <Dialog
          open={openDialog}
          onClose={resetForm}
          TransitionComponent={Fade}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {isAddMode ? "Thêm danh mục mới" : "Chỉnh sửa danh mục"}
            <IconButton
              onClick={resetForm}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Tên danh mục"
              fullWidth
              margin="dense"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                setError("");
              }}
              error={!!error}
              helperText={error}
              required
            />
            <TextField
              label="Mô tả"
              fullWidth
              margin="dense"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={resetForm} color="primary">
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={isAddMode ? addCategory : updateCategory}
              color="primary"
            >
              {isAddMode ? "Thêm Mới" : "Cập Nhật"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          TransitionComponent={Fade}
        >
          <DialogTitle>Xác Nhận Xóa</DialogTitle>
          <DialogContent>
            <Typography>Bạn có chắc chắn muốn xóa danh mục này?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
              Hủy
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteCategory(selectedCategoryId)}
            >
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default CategoryManagement;
