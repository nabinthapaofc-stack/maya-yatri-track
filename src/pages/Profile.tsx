import React, { useState, useEffect } from "react";
import { getAuthUser, setAuthUser } from "@/lib/authSession";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit, Save, XCircle } from "lucide-react";
import { fetchUserProfile, updateUserProfile, AuthServiceError } from "@/services/authService";
import { fetchDriverProfile, updateDriverProfile, DriverServiceError, DriverProfileResponse } from "@/services/driverService";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getAuthUser());
  const [profileData, setProfileData] = useState(currentUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Driver specific states
  const [driverProfile, setDriverProfile] = useState<DriverProfileResponse | null>(null);
  const [driverLoading, setDriverLoading] = useState(false);
  const [driverError, setDriverError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProfile = await fetchUserProfile(currentUser.id);
        setProfileData(fetchedProfile);

        if (fetchedProfile?.role === "driver") {
          setDriverLoading(true);
          try {
            const fetchedDriverProfile = await fetchDriverProfile(currentUser.id);
            setDriverProfile(fetchedDriverProfile);
          } catch (err) {
            const message = err instanceof DriverServiceError ? err.message : "Failed to load driver profile.";
            setDriverError(message);
            toast.error(message);
          } finally {
            setDriverLoading(false);
          }
        }
      } catch (err) {
        const message = err instanceof AuthServiceError ? err.message : "Failed to load profile.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [currentUser, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDriverInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (driverProfile) {
      if (id === "phone" || id === "license_number") {
        setDriverProfile((prev) => ({ ...prev!, [id]: value }));
      } else if (driverProfile.buses && driverProfile.buses.length > 0) {
        setDriverProfile((prev) => ({
          ...prev!,
          buses: [{ ...prev!.buses[0], [id]: value }],
        }));
      }
    }
  };

  const handleSave = async () => {
    if (!profileData) return;
    setLoading(true);
    setError(null);
    setDriverError(null);

    try {
      // Update general user profile
      const updatedProfile = await updateUserProfile(profileData.id, {
        name: profileData.name,
        email: profileData.email,
      });
      setProfileData(updatedProfile);
      setCurrentUser(updatedProfile); // Update current user in session

      // Update driver specific profile if applicable
      if (profileData.role === "driver" && driverProfile) {
        const driverUpdates = {
          phone: driverProfile.phone,
          license_number: driverProfile.license_number,
        };
        const busUpdates = driverProfile.buses && driverProfile.buses.length > 0 ? {
          bus_name: driverProfile.buses[0].bus_name,
          company_name: driverProfile.buses[0].company_name,
          route: driverProfile.buses[0].route,
        } : {};
        
        const updatedDriverProfile = await updateDriverProfile(profileData.id, driverUpdates, busUpdates);
        setDriverProfile(updatedDriverProfile);
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      const message = err instanceof AuthServiceError || err instanceof DriverServiceError ? err.message : "Failed to update profile.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null; // Should redirect by useEffect
  }

  if (loading || driverLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || driverError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Card className="shadow-lg p-6 text-center space-y-4">
          <XCircle className="w-16 h-16 text-destructive mx-auto" />
          <CardTitle>Error</CardTitle>
          <p className="text-muted-foreground">{error || driverError}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Your Profile</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)} disabled={loading}>
              {isEditing ? <XCircle className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profileData?.name || ""}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData?.email || ""}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
              />
            </div>
            <div>
              <Label>Role</Label>
              <Input value={profileData?.role || ""} disabled />
            </div>

            {profileData?.role === "driver" && driverProfile && (
              <>
                <h3 className="text-lg font-semibold mt-6">Driver Details</h3>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={driverProfile.phone || ""}
                    onChange={handleDriverInputChange}
                    disabled={!isEditing || loading}
                  />
                </div>
                <div>
                  <Label htmlFor="license_number">License Number</Label>
                  <Input
                    id="license_number"
                    value={driverProfile.license_number || ""}
                    onChange={handleDriverInputChange}
                    disabled={!isEditing || loading}
                  />
                </div>
                {driverProfile.buses && driverProfile.buses.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold mt-6">Bus Details</h3>
                    <div>
                      <Label htmlFor="bus_name">Bus Name</Label>
                      <Input
                        id="bus_name"
                        value={driverProfile.buses[0].bus_name || ""}
                        onChange={handleDriverInputChange}
                        disabled={!isEditing || loading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input
                        id="company_name"
                        value={driverProfile.buses[0].company_name || ""}
                        onChange={handleDriverInputChange}
                        disabled={!isEditing || loading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="route">Route</Label>
                      <Input
                        id="route"
                        value={driverProfile.buses[0].route || ""}
                        onChange={handleDriverInputChange}
                        disabled={!isEditing || loading}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {isEditing && (
              <Button className="w-full" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
