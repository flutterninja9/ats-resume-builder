"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  CalendarRange,
  GraduationCap,
  Link,
  Mail,
  Phone,
  Plus,
  Trash2,
  User,
  Wrench,
} from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

// Define types (can be moved to a separate types file later)
interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
}
interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
}
interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  details: string;
}
interface ResumeData {
  contact: ContactInfo;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string;
}

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: Dispatch<SetStateAction<ResumeData>>;
}

export function ResumeForm({ resumeData, setResumeData }: ResumeFormProps) {
  const [activeSection, setActiveSection] = useState("contact");

  const handleContactChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }));
  };

  const handleExperienceChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedExperience = [...resumeData.experience];
    if (!updatedExperience[index]) return; // Safety check
    updatedExperience[index] = { ...updatedExperience[index], [name]: value };
    setResumeData((prev) => ({ ...prev, experience: updatedExperience }));
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: crypto.randomUUID(),
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          responsibilities: "",
        },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    if (resumeData.experience.length <= 1) return; // Keep at least one
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleEducationChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedEducation = [...resumeData.education];
    if (!updatedEducation[index]) return; // Safety check
    updatedEducation[index] = { ...updatedEducation[index], [name]: value };
    setResumeData((prev) => ({ ...prev, education: updatedEducation }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: crypto.randomUUID(),
          institution: "",
          degree: "",
          startDate: "",
          endDate: "",
          details: "",
        },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    if (resumeData.education.length <= 1) return; // Keep at least one
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleSkillsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setResumeData((prev) => ({ ...prev, skills: e.target.value }));
  };

  // Determine progress percentage for the progress bar
  const calculateProgress = () => {
    let totalFields = 0;
    let filledFields = 0;

    // Contact section (5 fields)
    const contactFields = Object.values(resumeData.contact);
    totalFields += contactFields.length;
    filledFields += contactFields.filter((field) => field.trim() !== "").length;

    // Experience section (5 fields per entry)
    resumeData.experience.forEach((exp) => {
      totalFields += 5;
      if (exp.company.trim()) filledFields++;
      if (exp.role.trim()) filledFields++;
      if (exp.startDate.trim()) filledFields++;
      if (exp.endDate.trim()) filledFields++;
      if (exp.responsibilities.trim()) filledFields++;
    });

    // Education section (5 fields per entry)
    resumeData.education.forEach((edu) => {
      totalFields += 5;
      if (edu.institution.trim()) filledFields++;
      if (edu.degree.trim()) filledFields++;
      if (edu.startDate.trim()) filledFields++;
      if (edu.endDate.trim()) filledFields++;
      if (edu.details.trim()) filledFields++;
    });

    // Skills section (1 field)
    totalFields += 1;
    if (resumeData.skills.trim()) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  };

  const progressPercent = calculateProgress();

  // Navigation tabs with icons
  const NavigationTabs = () => (
    <div className="flex flex-col sm:flex-row gap-1 mb-6 bg-muted rounded-lg p-1">
      <Button
        variant={activeSection === "contact" ? "default" : "ghost"}
        size="sm"
        className="flex-1 justify-center"
        onClick={() => setActiveSection("contact")}
      >
        <User className="h-4 w-4 mr-2" /> Contact
      </Button>
      <Button
        variant={activeSection === "experience" ? "default" : "ghost"}
        size="sm"
        className="flex-1 justify-center"
        onClick={() => setActiveSection("experience")}
      >
        <Briefcase className="h-4 w-4 mr-2" /> Experience
      </Button>
      <Button
        variant={activeSection === "education" ? "default" : "ghost"}
        size="sm"
        className="flex-1 justify-center"
        onClick={() => setActiveSection("education")}
      >
        <GraduationCap className="h-4 w-4 mr-2" /> Education
      </Button>
      <Button
        variant={activeSection === "skills" ? "default" : "ghost"}
        size="sm"
        className="flex-1 justify-center"
        onClick={() => setActiveSection("skills")}
      >
        <Wrench className="h-4 w-4 mr-2" /> Skills
      </Button>
    </div>
  );

  return (
    <Card className="w-full h-full overflow-y-auto">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Resume Details</CardTitle>
            <CardDescription>Fill in your information below</CardDescription>
          </div>
          <div className="text-sm font-medium">{progressPercent}% complete</div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <NavigationTabs />

        {/* Contact Section */}
        {activeSection === "contact" && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-500" /> Contact
              Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" /> Full
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={resumeData.contact.name}
                  onChange={handleContactChange}
                  placeholder="John Doe"
                  className="transition-all focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" /> Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={resumeData.contact.email}
                  onChange={handleContactChange}
                  placeholder="john.doe@email.com"
                  className="transition-all focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" /> Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={resumeData.contact.phone}
                  onChange={handleContactChange}
                  placeholder="+1 123 456 7890"
                  className="transition-all focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center">
                  <Link className="h-4 w-4 mr-2 text-muted-foreground" />{" "}
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={resumeData.contact.linkedin}
                  onChange={handleContactChange}
                  placeholder="linkedin.com/in/johndoe"
                  className="transition-all focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="portfolio" className="flex items-center">
                  <Link className="h-4 w-4 mr-2 text-muted-foreground" />{" "}
                  Portfolio/Website URL
                </Label>
                <Input
                  id="portfolio"
                  name="portfolio"
                  value={resumeData.contact.portfolio}
                  onChange={handleContactChange}
                  placeholder="yourportfolio.com"
                  className="transition-all focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional, but recommended for design/development roles
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setActiveSection("experience")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next: Experience
              </Button>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {activeSection === "experience" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-blue-500" /> Work
              Experience
            </h3>

            {resumeData.experience.map((exp, index) => (
              <div
                key={exp.id}
                className="space-y-4 p-5 rounded-lg border bg-card/50 transition-all hover:shadow-md relative"
              >
                <div className="absolute top-3 right-3 flex space-x-1">
                  {resumeData.experience.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeExperience(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <h4 className="font-medium text-sm text-muted-foreground">
                  Position {index + 1}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`company-${index}`}>Company</Label>
                    <Input
                      id={`company-${index}`}
                      name="company"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, e)}
                      placeholder="Acme Corp"
                      className="transition-all focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`role-${index}`}>Job Title / Role</Label>
                    <Input
                      id={`role-${index}`}
                      name="role"
                      value={exp.role}
                      onChange={(e) => handleExperienceChange(index, e)}
                      placeholder="Software Engineer"
                      className="transition-all focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`startDate-exp-${index}`}
                      className="flex items-center"
                    >
                      <CalendarRange className="h-4 w-4 mr-2 text-muted-foreground" />{" "}
                      Start Date
                    </Label>
                    <Input
                      id={`startDate-exp-${index}`}
                      name="startDate"
                      value={exp.startDate}
                      onChange={(e) => handleExperienceChange(index, e)}
                      placeholder="Jan 2020"
                      className="transition-all focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`endDate-exp-${index}`}
                      className="flex items-center"
                    >
                      <CalendarRange className="h-4 w-4 mr-2 text-muted-foreground" />{" "}
                      End Date
                    </Label>
                    <Input
                      id={`endDate-exp-${index}`}
                      name="endDate"
                      value={exp.endDate}
                      onChange={(e) => handleExperienceChange(index, e)}
                      placeholder="Present or Dec 2022"
                      className="transition-all focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`responsibilities-${index}`}>
                    Responsibilities / Achievements
                  </Label>
                  <Textarea
                    id={`responsibilities-${index}`}
                    name="responsibilities"
                    value={exp.responsibilities}
                    onChange={(e) => handleExperienceChange(index, e)}
                    placeholder={`- Developed feature X resulting in Y% improvement...
- Led a team of X engineers to deliver Z project...
- Implemented CI/CD pipeline reducing deployment time by X%...`}
                    rows={4}
                    className="resize-y min-h-[100px] transition-all focus:ring-2 focus:ring-blue-500/20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use bullet points (start lines with &rsquo;-&rsquo;) for
                    better ATS readability. Focus on achievements with metrics
                    when possible.
                  </p>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addExperience}
              className="w-full py-6 border-dashed border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Another Position
            </Button>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setActiveSection("contact")}
              >
                Back: Contact
              </Button>
              <Button
                onClick={() => setActiveSection("education")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next: Education
              </Button>
            </div>
          </section>
        )}

        {/* Education Section */}
        {activeSection === "education" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-blue-500" /> Education
            </h3>

            {resumeData.education.map((edu, index) => (
              <div
                key={edu.id}
                className="space-y-4 p-5 rounded-lg border bg-card/50 transition-all hover:shadow-md relative"
              >
                <div className="absolute top-3 right-3 flex space-x-1">
                  {resumeData.education.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <h4 className="font-medium text-sm text-muted-foreground">
                  Education {index + 1}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`institution-${index}`}>Institution</Label>
                    <Input
                      id={`institution-${index}`}
                      name="institution"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, e)}
                      placeholder="University of Example"
                      className="transition-all focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`degree-${index}`}>
                      Degree / Field of Study
                    </Label>
                    <Input
                      id={`degree-${index}`}
                      name="degree"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, e)}
                      placeholder="B.Sc. Computer Science"
                      className="transition-all focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`startDate-edu-${index}`}
                      className="flex items-center"
                    >
                      <CalendarRange className="h-4 w-4 mr-2 text-muted-foreground" />{" "}
                      Start Date
                    </Label>
                    <Input
                      id={`startDate-edu-${index}`}
                      name="startDate"
                      value={edu.startDate}
                      onChange={(e) => handleEducationChange(index, e)}
                      placeholder="Sep 2016"
                      className="transition-all focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`endDate-edu-${index}`}
                      className="flex items-center"
                    >
                      <CalendarRange className="h-4 w-4 mr-2 text-muted-foreground" />{" "}
                      End Date/Graduation
                    </Label>
                    <Input
                      id={`endDate-edu-${index}`}
                      name="endDate"
                      value={edu.endDate}
                      onChange={(e) => handleEducationChange(index, e)}
                      placeholder="May 2020"
                      className="transition-all focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`details-${index}`}>
                    Relevant Coursework / Details
                  </Label>
                  <Textarea
                    id={`details-${index}`}
                    name="details"
                    value={edu.details}
                    onChange={(e) => handleEducationChange(index, e)}
                    placeholder={`- Relevant coursework: Data Structures, Algorithms
- Graduated with honors (GPA: 3.8/4.0)
- Senior project: [Project name and brief description]`}
                    rows={3}
                    className="resize-y min-h-[80px] transition-all focus:ring-2 focus:ring-blue-500/20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional. Include notable achievements, relevant coursework,
                    or projects.
                  </p>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addEducation}
              className="w-full py-6 border-dashed border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Another Education
            </Button>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setActiveSection("experience")}
              >
                Back: Experience
              </Button>
              <Button
                onClick={() => setActiveSection("skills")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next: Skills
              </Button>
            </div>
          </section>
        )}

        {/* Skills Section */}
        {activeSection === "skills" && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-blue-500" /> Skills
            </h3>
            <div className="space-y-2">
              <Label htmlFor="skills">Technical & Professional Skills</Label>
              <Textarea
                id="skills"
                name="skills"
                value={resumeData.skills}
                onChange={handleSkillsChange}
                placeholder="React, JavaScript, TypeScript, Node.js, Express, MongoDB, AWS, Agile Methodologies, Project Management, Team Leadership..."
                rows={6}
                className="resize-y min-h-[120px] transition-all focus:ring-2 focus:ring-blue-500/20"
              />
              <div className="bg-muted/50 p-3 rounded-md mt-4 text-sm">
                <h4 className="font-medium mb-2">
                  Tips for ATS-Friendly Skills:
                </h4>
                <ul className="space-y-1 list-disc pl-5 text-muted-foreground">
                  <li>Separate skills with commas or line breaks</li>
                  <li>Include keywords from the job description</li>
                  <li>List both technical skills and soft skills</li>
                  <li>Prioritize skills most relevant to the position</li>
                  <li>Avoid graphics, icons, or rating systems</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setActiveSection("education")}
              >
                Back: Education
              </Button>
              <Button
                onClick={() => setActiveSection("contact")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Complete Resume
              </Button>
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
