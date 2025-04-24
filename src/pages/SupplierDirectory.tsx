
const SupplierDirectory = () => {
  return (
    <MobilePage 
      title="Find Suppliers"
      backButton={true}
      rightAction={
        <Button size="icon" variant="ghost" className="rounded-full">
          <Search size={20} />
        </Button>
      }
    >
      <SupplierCategories />
    </MobilePage>
  );
};

export default SupplierDirectory;
