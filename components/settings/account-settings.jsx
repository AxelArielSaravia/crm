/**
 * @fileoverview Account settings component
 * @type-check
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Button } from "../ui/button.jsx"
import { Input } from "../ui/input.jsx"
import { Label } from "../ui/label.jsx"

/**
 * Account settings component
 * @param {Object} props - Component props
 * @param {Function} props.onChangePassword - Password change handler
 * @param {Function} props.onDeleteAccount - Account deletion handler
 * @param {boolean} [props.isLoading] - Loading state
 * @returns {JSX.Element} Account settings component
 */
export function AccountSettings({ onChangePassword, onDeleteAccount, isLoading = false }) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  /**
   * Handles password change form submission
   * @param {React.FormEvent} e - Form event
   */
  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match")
      return
    }

    setIsChangingPassword(true)
    try {
      await onChangePassword(passwordData.currentPassword, passwordData.newPassword)
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      console.error("Password change error:", error)
    } finally {
      setIsChangingPassword(false)
    }
  }

  /**
   * Handles account deletion
   */
  const handleDeleteAccount = () => {
    if (deleteConfirmText === "DELETE") {
      onDeleteAccount()
    } else {
      alert("Please type 'DELETE' to confirm account deletion")
    }
  }

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-foreground">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="bg-background border-border text-foreground"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-foreground">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isChangingPassword || isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isChangingPassword ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">Delete Account</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. This will permanently delete your account and remove
              all your data from our servers.
            </p>

            {!showDeleteConfirm ? (
              <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                Delete Account
              </Button>
            ) : (
              <div className="space-y-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-sm text-foreground">
                  Type <strong>DELETE</strong> to confirm account deletion:
                </p>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE here"
                  className="bg-background border-border text-foreground"
                />
                <div className="flex items-center gap-2">
                  <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteConfirmText !== "DELETE"}>
                    Permanently Delete Account
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDeleteConfirmText("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
