export const convertCategoriesToMenu = (categories, parentPath = "") => {
  return categories.map((category) => {
    // Construct the URL, including the parent path if it exists
    const categoryName = category.name.toLowerCase().replace(/ /g, "-");
    const urlPrefix = parentPath ? `${parentPath}/` : "";
    const menuItem = {
      title: category.name,
      url: `${urlPrefix}${categoryName}`,
    };

    if (category.subCategories && category.subCategories.length > 0) {
      // Concatenate the current path with the category name for subcategories
      const newPath = `${urlPrefix}${categoryName}`;
      menuItem.submenu = convertCategoriesToMenu(
        category.subCategories,
        newPath
      );
    }

    return menuItem;
  });
};
