import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileText, Phone, Mail, MapPin, Building, Stethoscope, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";

interface KYCStatus {
  level: 'unverified' | 'basic' | 'medical' | 'full';
  curp: string;
  phone: string;
  email: string;
  medicalLicense?: string;
  institution?: string;
  verified: boolean;
  expires: string;
}

export const KYCVerification = () => {
  const [activeTab, setActiveTab] = useState("status");
  const [kycData, setKycData] = useState({
    curp: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    medicalLicense: "",
    institution: ""
  });
  
  // Mock KYC status - in real app this would come from the contract
  const [kycStatus, setKycStatus] = useState<KYCStatus>({
    level: 'basic',
    curp: 'GOME850615HJCNZR01',
    phone: '5551234567',
    email: 'maria@example.com',
    verified: true,
    expires: '2025-12-31'
  });

  const handleInputChange = (field: string, value: string) => {
    setKycData(prev => ({ ...prev, [field]: value }));
  };

  const validateCURP = (curp: string) => {
    return curp.length === 18 && /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/.test(curp);
  };

  const validatePhone = (phone: string) => {
    return phone.length === 10 && /^[0-9]{10}$/.test(phone);
  };

  const handleSubmitBasicKYC = () => {
    if (!validateCURP(kycData.curp)) {
      alert("CURP inválido. Debe tener 18 caracteres con formato correcto.");
      return;
    }
    
    if (!validatePhone(kycData.phone)) {
      alert("Número de teléfono inválido. Debe tener 10 dígitos.");
      return;
    }

    // Here would call smart contract register_kyc function
    console.log("Registering basic KYC:", kycData);
    alert("KYC básico enviado para verificación");
  };

  const handleSubmitMedicalKYC = () => {
    if (!kycData.medicalLicense || !kycData.institution) {
      alert("Debe proporcionar cédula profesional e institución médica.");
      return;
    }

    // Here would call smart contract register_kyc function with medical data
    console.log("Registering medical KYC:", kycData);
    alert("KYC médico enviado para verificación");
  };

  const getKYCLevelBadge = (level: string) => {
    switch (level) {
      case 'unverified':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Sin Verificar</Badge>;
      case 'basic':
        return <Badge variant="secondary"><Shield className="w-3 h-3 mr-1" />Básico</Badge>;
      case 'medical':
        return <Badge className="bg-brand-verde-titulo text-white"><Stethoscope className="w-3 h-3 mr-1" />Médico</Badge>;
      case 'full':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Completo</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-brand-verde-titulo">Verificación de Identidad (KYC)</h1>
          <p className="text-brand-gris-savia">
            Verifica tu identidad para acceder a todas las funciones de la plataforma
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">Estado KYC</TabsTrigger>
            <TabsTrigger value="basic">KYC Básico</TabsTrigger>
            <TabsTrigger value="medical">KYC Médico</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-6">
            <Card className="shadow-card border-brand-amarillo-trazo/20">
              <CardHeader>
                <CardTitle className="flex items-center text-brand-verde-titulo">
                  <Shield className="w-5 h-5 mr-2" />
                  Estado de Verificación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-brand-amarillo-relleno rounded-lg border border-brand-amarillo-trazo/30">
                    <div>
                      <div className="font-medium text-brand-verde-titulo">Nivel de Verificación</div>
                      <div className="text-sm text-brand-gris-savia">
                        Determina qué funciones puedes usar
                      </div>
                    </div>
                    {getKYCLevelBadge(kycStatus.level)}
                  </div>

                  {kycStatus.verified && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-brand-amarillo-trazo/20 rounded-lg bg-brand-amarillo-relleno/50">
                          <div className="flex items-center mb-2">
                            <FileText className="w-4 h-4 mr-2 text-brand-verde-titulo" />
                            <span className="font-medium text-brand-verde-titulo">CURP</span>
                          </div>
                          <div className="text-sm text-brand-gris-savia">{kycStatus.curp}</div>
                        </div>

                        <div className="p-4 border border-brand-amarillo-trazo/20 rounded-lg bg-brand-amarillo-relleno/50">
                          <div className="flex items-center mb-2">
                            <Phone className="w-4 h-4 mr-2 text-brand-verde-titulo" />
                            <span className="font-medium text-brand-verde-titulo">Teléfono</span>
                          </div>
                          <div className="text-sm text-brand-gris-savia">{kycStatus.phone}</div>
                        </div>

                        <div className="p-4 border border-brand-amarillo-trazo/20 rounded-lg bg-brand-amarillo-relleno/50">
                          <div className="flex items-center mb-2">
                            <Mail className="w-4 h-4 mr-2 text-brand-verde-titulo" />
                            <span className="font-medium text-brand-verde-titulo">Email</span>
                          </div>
                          <div className="text-sm text-brand-gris-savia">{kycStatus.email}</div>
                        </div>

                        <div className="p-4 border border-brand-amarillo-trazo/20 rounded-lg bg-brand-amarillo-relleno/50">
                          <div className="flex items-center mb-2">
                            <Clock className="w-4 h-4 mr-2 text-brand-verde-titulo" />
                            <span className="font-medium text-brand-verde-titulo">Vencimiento</span>
                          </div>
                          <div className="text-sm text-brand-gris-savia">{kycStatus.expires}</div>
                        </div>
                      </div>

                      {kycStatus.medicalLicense && (
                        <div className="p-4 bg-gradient-savia border border-brand-amarillo-trazo/30 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Stethoscope className="w-4 h-4 mr-2 text-brand-verde-titulo" />
                            <span className="font-medium text-brand-verde-titulo">Verificación Médica</span>
                          </div>
                          <div className="text-sm text-brand-gris-savia">
                            Cédula: {kycStatus.medicalLicense}<br />
                            Institución: {kycStatus.institution}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <Alert className="border-brand-amarillo-trazo/30 bg-brand-amarillo-relleno/30">
                    <AlertCircle className="h-4 w-4 text-brand-verde-titulo" />
                    <AlertDescription className="text-brand-gris-savia">
                      La verificación KYC es requerida para crear campañas y acceder a funciones avanzadas. 
                      Los datos se almacenan de forma segura en la blockchain de Stellar.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="basic" className="space-y-6">
            <Card className="shadow-card border-brand-amarillo-trazo/20">
              <CardHeader>
                <CardTitle className="text-brand-verde-titulo">Verificación Básica</CardTitle>
                <p className="text-sm text-brand-gris-savia">
                  Completa tu verificación básica con CURP y teléfono mexicano
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="curp" className="text-brand-verde-titulo">CURP *</Label>
                      <Input
                        id="curp"
                        placeholder="ABCD123456HDFGHI01"
                        value={kycData.curp}
                        onChange={(e) => handleInputChange('curp', e.target.value.toUpperCase())}
                        maxLength={18}
                        className="border-brand-amarillo-trazo/30 focus:border-brand-verde-titulo"
                      />
                      <div className="text-xs text-brand-gris-savia">
                        18 caracteres del formato oficial mexicano
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-brand-verde-titulo">Nombre Completo *</Label>
                      <Input
                        id="fullName"
                        placeholder="María González López"
                        value={kycData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="border-brand-amarillo-trazo/30 focus:border-brand-verde-titulo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-brand-verde-titulo">Teléfono *</Label>
                      <Input
                        id="phone"
                        placeholder="5551234567"
                        value={kycData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        maxLength={10}
                        className="border-brand-amarillo-trazo/30 focus:border-brand-verde-titulo"
                      />
                      <div className="text-xs text-brand-gris-savia">
                        10 dígitos sin espacios ni guiones
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-brand-verde-titulo">Correo Electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="maria@example.com"
                        value={kycData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="border-brand-amarillo-trazo/30 focus:border-brand-verde-titulo"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-brand-verde-titulo">Dirección *</Label>
                    <Input
                      id="address"
                      placeholder="Calle, Número, Colonia, Ciudad, Estado"
                      value={kycData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="border-brand-amarillo-trazo/30 focus:border-brand-verde-titulo"
                    />
                  </div>

                  <Alert className="border-brand-amarillo-trazo/30 bg-brand-amarillo-relleno/30">
                    <Shield className="h-4 w-4 text-brand-verde-titulo" />
                    <AlertDescription className="text-brand-gris-savia">
                      Tu información personal está protegida y solo se usa para verificación. 
                      Los datos se almacenan de forma segura en la blockchain.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    onClick={handleSubmitBasicKYC}
                    className="w-full bg-brand-verde-titulo hover:bg-brand-verde-titulo/90 text-white"
                    disabled={!kycData.curp || !kycData.fullName || !kycData.phone || !kycData.email}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Enviar Verificación Básica
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical" className="space-y-6">
            <Card className="shadow-card border-brand-amarillo-trazo/20">
              <CardHeader>
                <CardTitle className="flex items-center text-brand-verde-titulo">
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Verificación Médica
                </CardTitle>
                <p className="text-sm text-brand-gris-savia">
                  Para profesionales de la salud que quieren verificar documentación médica
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="border-brand-amarillo-trazo/30 bg-brand-amarillo-relleno/30">
                    <AlertCircle className="h-4 w-4 text-brand-verde-titulo" />
                    <AlertDescription className="text-brand-gris-savia">
                      Primero completa tu verificación básica antes de proceder con la verificación médica.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medicalLicense" className="text-brand-verde-titulo">Cédula Profesional *</Label>
                      <Input
                        id="medicalLicense"
                        placeholder="1234567"
                        value={kycData.medicalLicense}
                        onChange={(e) => handleInputChange('medicalLicense', e.target.value)}
                        className="border-brand-amarillo-trazo/30 focus:border-brand-verde-titulo"
                      />
                      <div className="text-xs text-brand-gris-savia">
                        Número de cédula profesional emitida por la SEP
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="institution" className="text-brand-verde-titulo">Institución Médica *</Label>
                      <Input
                        id="institution"
                        placeholder="Hospital General de México"
                        value={kycData.institution}
                        onChange={(e) => handleInputChange('institution', e.target.value)}
                        className="border-brand-amarillo-trazo/30 focus:border-brand-verde-titulo"
                      />
                      <div className="text-xs text-brand-gris-savia">
                        Hospital, clínica o institución donde laboras
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-savia border border-brand-amarillo-trazo/30 rounded-lg">
                    <h4 className="font-medium text-brand-verde-titulo mb-2">Beneficios de la Verificación Médica</h4>
                    <ul className="text-sm text-brand-gris-savia space-y-1">
                      <li>• Verificar documentación médica de pacientes</li>
                      <li>• Acceso a herramientas de validación avanzadas</li>
                      <li>• Mayor confianza en tus verificaciones</li>
                      <li>• Participar en el proceso de revisión médica</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={handleSubmitMedicalKYC}
                    className="w-full bg-brand-verde-titulo hover:bg-brand-verde-titulo/90 text-white"
                    disabled={!kycData.medicalLicense || !kycData.institution}
                  >
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Enviar Verificación Médica
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};