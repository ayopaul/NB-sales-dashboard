import { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Main } from '@/components/layout/Main';
import { Search } from '@/components/layout/Search';
import { ThemeSwitch } from '@/components/layout/ThemeSwitch';
import { ProfileDropdown } from '@/components/layout/ProfileDropdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  Eye,
  Clock,
  FileText,
} from 'lucide-react';
import { brands, zones } from '@/data/salesData';

export default function UploadData() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Mock upload history
  const [uploadHistory] = useState([
    {
      id: 1,
      filename: 'sales_data_dec_2024.xlsx',
      date: '2024-12-28',
      status: 'success',
      records: 1524,
      regions: 15,
    },
    {
      id: 2,
      filename: 'sales_data_nov_2024.xlsx',
      date: '2024-11-30',
      status: 'success',
      records: 1489,
      regions: 15,
    },
    {
      id: 3,
      filename: 'sales_data_oct_2024.xlsx',
      date: '2024-10-31',
      status: 'success',
      records: 1456,
      regions: 15,
    },
  ]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(
      (file) =>
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'text/csv' ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls') ||
        file.name.endsWith('.csv')
    );

    if (validFiles.length > 0) {
      setUploadedFiles(validFiles);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadProgress(0);
  };

  const downloadTemplate = () => {
    // In a real app, this would download an actual template file
    alert('Template download would start here');
  };

  return (
    <>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Upload Sales Data</h2>
          <p className="text-muted-foreground">
            Import your sales data to update the dashboard
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Drop Zone */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload File</CardTitle>
                <CardDescription>
                  Upload Excel (.xlsx, .xls) or CSV files containing sales data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">
                    Drag and drop your file here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse your files
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileInput}
                  />
                  <Button asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Browse Files
                    </label>
                  </Button>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                      >
                        <FileSpreadsheet className="w-8 h-8 text-green-600" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        {isUploading ? (
                          <div className="w-24">
                            <Progress value={uploadProgress} className="h-2" />
                          </div>
                        ) : uploadProgress === 100 ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : null}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}

                    {uploadProgress === 100 && (
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <Eye className="mr-2 w-4 h-4" />
                          Preview Data
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Import to Dashboard
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upload History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload History</CardTitle>
                <CardDescription>Recent data uploads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadHistory.map((upload) => (
                    <div
                      key={upload.id}
                      className="flex items-center gap-3 p-3 rounded-lg border"
                    >
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{upload.filename}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{upload.date}</span>
                          <span>|</span>
                          <span>{upload.records} records</span>
                          <span>|</span>
                          <span>{upload.regions} regions</span>
                        </div>
                      </div>
                      <Badge
                        variant={upload.status === 'success' ? 'default' : 'destructive'}
                        className={upload.status === 'success' ? 'bg-green-500' : ''}
                      >
                        {upload.status === 'success' ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        )}
                        {upload.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Template Download */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Template</CardTitle>
                <CardDescription>
                  Download our template to ensure correct formatting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={downloadTemplate}>
                  <Download className="mr-2 w-4 h-4" />
                  Download Template
                </Button>
              </CardContent>
            </Card>

            {/* Data Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Requirements</CardTitle>
                <CardDescription>Required columns and format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Required Columns:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>- Region Name</li>
                    <li>- Zone</li>
                    <li>- Month/Year</li>
                    <li>- Volume (hL)</li>
                    <li>- Brand</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">Supported Brands:</p>
                  <div className="flex flex-wrap gap-1">
                    {brands.slice(0, 6).map((brand) => (
                      <Badge key={brand.id} variant="secondary" className="text-xs">
                        {brand.name}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="text-xs">
                      +{brands.length - 6} more
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">Zones:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.values(zones).map((zone) => (
                      <Badge
                        key={zone.name}
                        variant="secondary"
                        className="text-xs"
                        style={{ backgroundColor: zone.color + '20', color: zone.color }}
                      >
                        {zone.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Having trouble uploading your data? Contact support or check our documentation.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  );
}
